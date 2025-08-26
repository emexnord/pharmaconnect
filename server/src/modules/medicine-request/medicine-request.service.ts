import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MedicineRequest,
  MedicineRequestDocument,
} from './entities/medicine-request.entity';
import { Model, Types, PipelineStage } from 'mongoose';
import {
  CreateMedicineRequestDto,
  GetRequestsQueryDto,
} from './dto/create-request.dto';
import { PharmacyService } from '../pharmacy/pharmacy.service';
import { SocketGateway } from '../socket/socket.gateway';
import { ResponseType } from '../medicine-response/entities/medicine-response.type';

@Injectable()
export class MedicineRequestService {
  constructor(
    @InjectModel(MedicineRequest.name)
    private readonly medicineRequestModel: Model<MedicineRequestDocument>,
    private readonly pharmacyService: PharmacyService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async getMedicineRequestById(
    id: string,
  ): Promise<MedicineRequestDocument | null> {
    const result = await this.medicineRequestModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'pharmacies',
          localField: 'pharmacy',
          foreignField: '_id',
          as: 'pharmacy',
        },
      },
      {
        $unwind: {
          path: '$pharmacy',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'medicineresponses',
          localField: '_id',
          foreignField: 'request',
          as: 'responses',
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return result[0] ?? null;
  }

  async createMedicineRequest(
    createRequestDto: CreateMedicineRequestDto,
    pharmacyId: string,
  ): Promise<MedicineRequestDocument | null> {
    const pharmacy = await this.pharmacyService.findById(pharmacyId);
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID ${pharmacyId} not found`);
    }

    const createdRequest = await this.medicineRequestModel.create({
      medicineName: createRequestDto.medicineName,
      pharmacy: pharmacy._id,
      isUrgent: createRequestDto.isUrgent,
    });

    try {
      // After storing, emit to nearby pharmacies
      await this.socketGateway.broadcastRequestToNearby(createdRequest);
      return createdRequest;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating medicine request: ${error.message}`,
      );
    }
  }

  async getActiveRequestsByPharmacy(
    pharmacyId: string,
  ): Promise<MedicineRequest[]> {
    return this.medicineRequestModel
      .find({
        pharmacy: new Types.ObjectId(pharmacyId),
        fulfilled: false,
      })
      .exec();
  }

  // Get my requests with responses
  async getMyRequests(pharmacyId: string) {
    return this.medicineRequestModel.aggregate([
      { $match: { pharmacy: pharmacyId } },
      {
        $lookup: {
          from: 'medicineresponses',
          localField: '_id',
          foreignField: 'request',
          as: 'responses',
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  }

  // 2. Get requests by others within my listening radius
  async getRequests(pharmacyId: string, query: GetRequestsQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const myPharmacy = await this.pharmacyService.findById(pharmacyId);
    if (!myPharmacy) throw new NotFoundException('Pharmacy not found');

    const nearbyIds =
      await this.pharmacyService.getNearbyPharmaciesToListen(pharmacyId);
    if (!nearbyIds.length) return [];

    const pipeline: PipelineStage[] = [
      // find active requests which are within my listening radius
      {
        $match: {
          pharmacy: { $in: nearbyIds },
          fulfilled: false,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      // Lookup pharmacy details
      {
        $lookup: {
          from: 'pharmacies',
          localField: 'pharmacy',
          foreignField: '_id',
          as: 'pharmacy',
        },
      },
      // Unwind pharmacy details
      { $unwind: '$pharmacy' },
      // Lookup medicine response details
      {
        $lookup: {
          from: 'medicineresponses',
          localField: '_id',
          foreignField: 'request',
          as: 'responses',
        },
      },
      // add response counts for each response type
      {
        $addFields: {
          responseCounts: {
            have: {
              $size: {
                $filter: {
                  input: '$responses',
                  as: 'resp',
                  cond: { $eq: ['$$resp.response', ResponseType.HAVE] },
                },
              },
            },
            substitute: {
              $size: {
                $filter: {
                  input: '$responses',
                  as: 'resp',
                  cond: { $eq: ['$$resp.response', ResponseType.SUBSTITUTE] },
                },
              },
            },
            notSure: {
              $size: {
                $filter: {
                  input: '$responses',
                  as: 'resp',
                  cond: { $eq: ['$$resp.response', ResponseType.NOT_SURE] },
                },
              },
            },
            notHave: {
              $size: {
                $filter: {
                  input: '$responses',
                  as: 'resp',
                  cond: { $eq: ['$$resp.response', ResponseType.NOT_HAVE] },
                },
              },
            },
          },
        },
      },
      { $project: { responses: 0 } }, // don’t return raw responses
    ];

    return this.medicineRequestModel.aggregate(pipeline);
  }

  async markAsResolved(requestId: string): Promise<MedicineRequest> {
    const request = await this.medicineRequestModel.findById(requestId);
    if (!request) throw new NotFoundException('Request not found');
    request.fulfilled = true;
    return request.save();
  }

  async cancelRequest(requestId: string): Promise<MedicineRequest> {
    const request = await this.medicineRequestModel.findById(requestId);
    if (!request) throw new NotFoundException('Request not found');
    await request.deleteOne(); // or `request.cancelled = true` if you want soft delete
    return request;
  }
}

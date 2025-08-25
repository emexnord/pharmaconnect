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
import { Model, Types } from 'mongoose';
import { CreateMedicineRequestDto } from './dto/create-request.dto';
import { PharmacyService } from '../pharmacy/pharmacy.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class MedicineRequestService {
  constructor(
    @InjectModel(MedicineRequest.name)
    private readonly medicineRequestModel: Model<MedicineRequestDocument>,
    private readonly pharmacyService: PharmacyService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async createMedicineRequest(
    createRequestDto: CreateMedicineRequestDto,
    pharmacyId: string,
  ): Promise<MedicineRequestDocument | null> {
    const pharmacy = await this.pharmacyService.findById(pharmacyId);
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID ${pharmacyId} not found`);
    }
    try {
      const createdRequest = await this.medicineRequestModel.create({
        medicineName: createRequestDto.medicineName,
        pharmacy: pharmacyId,
        isUrgent: createRequestDto.isUrgent,
      });

      // After storing, emit to nearby pharmacies
      this.socketGateway.broadcastRequestToNearby({
        medicineName: createdRequest.medicineName,
        longitude: pharmacy.location.coordinates[0],
        latitude: pharmacy.location.coordinates[1],
        pharmacyId: createdRequest.pharmacy.toString(),
      });
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

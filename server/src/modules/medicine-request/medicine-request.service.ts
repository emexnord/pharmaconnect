import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  MedicineRequest,
  MedicineRequestDocument,
} from './entities/medicine-request.entity';
import { Model } from 'mongoose';
import { CreateMedicineRequestDto } from './dto/create-request.dto';
import { PharmacyService } from '../pharmacy/pharmacy.service';

@Injectable()
export class MedicineRequestService {
  constructor(
    @InjectModel(MedicineRequest.name)
    private readonly medicineRequestModel: Model<MedicineRequestDocument>,
    private readonly pharmacyService: PharmacyService,
  ) {}

  async createMedicineRequest(
    createRequestDto: CreateMedicineRequestDto,
  ): Promise<MedicineRequestDocument | null> {
    const pharmacy = await this.pharmacyService.findById(
      createRequestDto.pharmacyId,
    );
    if (!pharmacy) {
      throw new NotFoundException(
        `Pharmacy with ID ${createRequestDto.pharmacyId} not found`,
      );
    }
    try {
      const createdRequest = await this.medicineRequestModel.create({
        medicineName: createRequestDto.medicineName,
        pharmacy: createRequestDto.pharmacyId,
      });
      return createdRequest;
    } catch (error) {
      console.error('Error creating medicine request:', error);
      return null;
    }
  }

  findAll() {
    return `This action returns all request`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${JSON.stringify(updateRequestDto)} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}

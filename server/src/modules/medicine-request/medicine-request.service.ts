import { Injectable } from '@nestjs/common';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  MedicineRequest,
  MedicineRequestDocument,
} from './entities/medicine-request.entity';
import { Model } from 'mongoose';
import { CreateMedicineRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(MedicineRequest.name)
    private readonly medicineRequestModel: Model<MedicineRequestDocument>,
  ) {}

  async createMedicineRequest(
    createRequestDto: CreateMedicineRequestDto,
  ): Promise<MedicineRequestDocument | null> {
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

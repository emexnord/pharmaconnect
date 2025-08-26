import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MedicineResponse,
  MedicineResponseDocument,
} from './entities/medicine-response.entity';
import { ResponseType } from './entities/medicine-response.type';

@Injectable()
export class MedicineResponseService {
  constructor(
    @InjectModel(MedicineResponse.name)
    private readonly medicineResponseModel: Model<MedicineResponseDocument>,
  ) {}

  // 1. Create a response
  async createResponse(
    requestId: string,
    responderId: string,
    response: ResponseType,
    note?: string,
  ): Promise<MedicineResponse> {
    const newResponse = new this.medicineResponseModel({
      request: new Types.ObjectId(requestId),
      responder: new Types.ObjectId(responderId),
      response,
      note,
    });

    return newResponse.save();
  }

  // 2. Get responses by requestId and optionally filter by response type
  async getResponses(
    requestId: string,
    responseType?: ResponseType,
  ): Promise<MedicineResponse[]> {
    const filter: any = { request: new Types.ObjectId(requestId) };
    if (responseType) {
      filter.response = responseType;
    }

    const responses = await this.medicineResponseModel.find(filter).exec();

    if (!responses || responses.length === 0) {
      throw new NotFoundException('No responses found for this request');
    }

    return responses;
  }
}

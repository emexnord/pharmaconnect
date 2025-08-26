import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ResponseType } from './medicine-response.type';

export type MedicineResponseDocument = Document & MedicineResponse;

@Schema({ timestamps: true })
export class MedicineResponse {
  @Prop({ type: Types.ObjectId, ref: 'MedicineRequest', required: true })
  request: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pharmacy', required: true })
  responder: Types.ObjectId;

  @Prop({ required: true, enum: ResponseType })
  response: ResponseType;

  @Prop()
  note: string;
}

export const MedicineResponseSchema =
  SchemaFactory.createForClass(MedicineResponse);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MedicineRequestDocument = Document & MedicineRequest;

@Schema({ timestamps: true })
export class MedicineRequest {
  @Prop({ required: true })
  medicineName: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Pharmacy' })
  pharmacy: Types.ObjectId;

  @Prop({ default: false })
  fulfilled: boolean;
}

export const MedicineRequestSchema =
  SchemaFactory.createForClass(MedicineRequest);

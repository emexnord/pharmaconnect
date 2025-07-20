import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class MedicineResponse extends Document {
  @Prop({ type: Types.ObjectId, ref: 'MedicineRequest', required: true })
  request: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pharmacy', required: true })
  responder: Types.ObjectId;

  @Prop({ required: true })
  available: boolean;

  @Prop()
  note: string;
}

export const MedicineResponseSchema =
  SchemaFactory.createForClass(MedicineResponse);

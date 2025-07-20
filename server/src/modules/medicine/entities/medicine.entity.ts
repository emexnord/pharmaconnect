import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Medicine extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  brand: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Pharmacy', required: true })
  pharmacy: Types.ObjectId;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);

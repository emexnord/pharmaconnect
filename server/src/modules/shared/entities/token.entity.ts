import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { TokenStatus, TokenType } from '../enums/token-type.enum';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Pharmacy' })
  pharmacyId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, enum: TokenType })
  type: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: TokenStatus.PENDING, enum: TokenStatus })
  status: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Compound unique index to ensure one token per pharmacy per type
TokenSchema.index({ pharmacyId: 1, type: 1 }, { unique: true });

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './entities/token.entity';
import { Model, Types } from 'mongoose';

import { TokenType } from './enums/token-type.enum';
import {
  generateOTP,
  generatePasswordResetToken,
  generateRegistrationKey,
} from 'src/utils/generate-token';
import {
  OTP_EXPIRATION_TIME,
  PASSWORD_RESET_EXP_TIME,
  REGISTRATION_KEY_EXP_TIME,
} from 'src/constants';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private readonly tokenModel: Model<Token>,
  ) {}

  // Overwrite previous otp if it exists, else create a new one
  async createEmailVerificationToken(pharmacyId: string): Promise<Token> {
    const otp = generateOTP();
    const token = await this.tokenModel.findOneAndUpdate(
      { pharmacyId, type: TokenType.EMAIL_VERIFICATION },
      {
        pharmacyId,
        token: otp,
        type: TokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + OTP_EXPIRATION_TIME),
      },
      { upsert: true, new: true },
    );
    return token;
  }

  // Overwrite previous token if it exists, else create a new one
  async createPasswordResetToken(pharmacyId: string): Promise<Token> {
    const token = await this.tokenModel.findOneAndUpdate(
      { pharmacyId, type: TokenType.PASSWORD_RESET },
      {
        pharmacyId,
        type: TokenType.PASSWORD_RESET,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_EXP_TIME),
        token: generatePasswordResetToken(),
      },
      { upsert: true, new: true },
    );
    return token;
  }

  async createRegistrationKey(pharmacyId: string): Promise<Token> {
    const token = await this.tokenModel.findOneAndUpdate(
      { pharmacyId, type: TokenType.REGISTRATION_KEY },
      {
        pharmacyId,
        type: TokenType.REGISTRATION_KEY,
        expiresAt: new Date(Date.now() + REGISTRATION_KEY_EXP_TIME),
        token: generateRegistrationKey(),
      },
      { upsert: true, new: true },
    );
    return token;
  }

  async findTokenById(tokenId: string): Promise<Token | null> {
    return this.tokenModel.findById(tokenId);
  }

  async findTokenByPharmacyId(
    pharmacyId: string | Types.ObjectId,
    type: TokenType,
  ): Promise<Token | null> {
    return this.tokenModel.findOne({ pharmacyId: pharmacyId.toString(), type });
  }

  async deleteTokenById(tokenId: string): Promise<Token | null> {
    return this.tokenModel.findByIdAndDelete(tokenId);
  }

  async deleteTokensByPharmacyId(
    pharmacyId: string,
    type: TokenType,
  ): Promise<number> {
    const result = await this.tokenModel.deleteMany({ pharmacyId, type });
    return result.deletedCount || 0;
  }
}

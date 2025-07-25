import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import configuration from '../../config';
import { Pharmacy } from '../pharmacy/entities/pharmacy.entity';

const config = configuration();

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(pharmacy: Pharmacy): Promise<string> {
    const accessTokenPayload = {
      _id: pharmacy._id,
      phone: pharmacy.phone,
      name: pharmacy.name,
      email: pharmacy.email,
    };
    // const refreshTokenPayload = { _id: user._id };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: config.jwt.accessTokenSecret,
      expiresIn: config.jwt.accessTokenExpiry,
    });
    // const refreshToken = this.jwtService.sign(refreshTokenPayload, {
    //   secret: config.jwt.refreshTokenSecret,
    //   expiresIn: config.jwt.refreshTokenExpiry,
    // });

    return accessToken;
  }
}

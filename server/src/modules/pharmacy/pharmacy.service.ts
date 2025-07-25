import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { JwtAuthService } from '../jwt/jwt.service';
import { Pharmacy, PharmacyDocument } from './entities/pharmacy.entity';
import { RegisterPharmacyDto } from './dto/register-pharmacy.dto';
import { LoginPharmacyDto } from './dto/login-pharmacy.dto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Pharmacy.name)
    private pharmacyModel: Model<PharmacyDocument>,
    private jwtService: JwtAuthService,
  ) {}

  async findById(id: string): Promise<PharmacyDocument | null> {
    return this.pharmacyModel.findById(id).exec();
  }
  async register(
    dto: RegisterPharmacyDto,
  ): Promise<{ pharmacy: PharmacyDocument; token: string }> {
    // Check for duplicates
    const existing = await this.pharmacyModel.findOne({
      $or: [{ email: dto.email }, { phone: dto.phone }],
    });
    if (existing) {
      throw new BadRequestException('Email or phone already registered');
    }

    // Generate unique short code
    let shortCode: string;
    let isUnique = false;
    do {
      shortCode = nanoid(6); // 6-character alphanumeric code
      const existingCode = await this.pharmacyModel.findOne({ shortCode });
      isUnique = !existingCode;
    } while (!isUnique);

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create pharmacy
    const pharmacy = await this.pharmacyModel.create({
      name: dto.name,
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude], // [longitude, latitude]
      },
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
      password: hashedPassword,
      shortCode,
    });

    // Generate JWT
    const token = await this.jwtService.login(pharmacy);

    return { pharmacy, token };
  }

  async login(
    dto: LoginPharmacyDto,
  ): Promise<{ pharmacy: PharmacyDocument; token: string }> {
    const pharmacy = await this.pharmacyModel.findOne({
      phone: dto.phone,
    });
    if (!pharmacy) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      pharmacy.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const token = await this.jwtService.login(pharmacy);
    return { pharmacy, token };
  }
}

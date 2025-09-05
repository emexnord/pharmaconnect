import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as geolib from 'geolib'; // npm install geolib

import { JwtAuthService } from '../jwt/jwt.service';
import { Pharmacy, PharmacyDocument } from './entities/pharmacy.entity';
import { RegisterPharmacyDto } from './dto/register-pharmacy.dto';
import { LoginPharmacyDto } from './dto/login-pharmacy.dto';
import { TokenService } from '../shared/token.service';
import { TokenType } from '../shared/enums/token-type.enum';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Pharmacy.name)
    private pharmacyModel: Model<PharmacyDocument>,
    private jwtService: JwtAuthService,
    private tokenService: TokenService,
  ) {}

  async findById(
    id: string | Types.ObjectId,
  ): Promise<PharmacyDocument | null> {
    const objectId = new Types.ObjectId(id);
    return this.pharmacyModel.findById(objectId).exec();
  }

  async register(
    dto: RegisterPharmacyDto,
  ): Promise<{ pharmacy: PharmacyDocument; registrationKey: string }> {
    // Check for duplicates
    const existing = await this.pharmacyModel.findOne({
      $or: [{ email: dto.email }, { phone: dto.phone }],
    });
    if (existing) {
      throw new BadRequestException('Email or phone already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create pharmacy
    const pharmacy = await this.pharmacyModel.create({
      _id: new Types.ObjectId(),
      name: dto.name,
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude], // [longitude, latitude]
      },
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
      password: hashedPassword,
      notificationRadiusMeter: dto.notificationRadiusMeter || 5000,
      isVerified: true,
    });

    // Generate JWT
    // const token = await this.jwtService.login(pharmacy);
    const registrationKey = await this.tokenService.createRegistrationKey(
      pharmacy._id,
    );

    return { pharmacy, registrationKey: registrationKey.token };
  }

  async completeRegistration(registrationKey: string): Promise<{
    pharmacy: PharmacyDocument;
  }> {
    // Validate registration key
    const tokenDoc = await this.tokenService.findTokenByPharmacyId(
      registrationKey,
      TokenType.REGISTRATION_KEY,
    );
    if (!tokenDoc) {
      throw new BadRequestException('Invalid registration key');
    }
    if (tokenDoc.expiresAt < new Date()) {
      throw new BadRequestException('Registration key has expired');
    }

    const pharmacy = await this.findById(tokenDoc.pharmacyId);
    if (!pharmacy) {
      throw new NotFoundException('Pharmacy not found');
    }
    if (pharmacy.isActive) {
      throw new BadRequestException('Pharmacy is already active');
    }

    pharmacy.isActive = true;
    await pharmacy.save();
    // const jwtToken = await this.jwtService.login(pharmacy);
    // await this.tokenService.deleteTokenById(tokenDoc.id);

    return { pharmacy };
  }

  async setPasswordForNewPharmacy(
    pharmacyId: string,
    newPassword: string,
  ): Promise<void> {
    const pharmacy = await this.findById(pharmacyId);
    if (!pharmacy) {
      throw new NotFoundException('Pharmacy not found');
    }
    if (pharmacy.isActive) {
      throw new BadRequestException('Pharmacy is already active');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    pharmacy.password = hashedPassword;
    await pharmacy.save();
  }

  async login(
    dto: LoginPharmacyDto,
  ): Promise<{ pharmacy: PharmacyDocument; token: string }> {
    const pharmacy = await this.findWithSensitiveFields({
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

  async findWithSensitiveFields(filter: any): Promise<PharmacyDocument | null> {
    return this.pharmacyModel.findOne(filter).select('+password').exec();
  }

  // Find pharmacies within listening range
  async getNearbyPharmaciesToListen(pharmacyId: string): Promise<string[]> {
    const myPharmacy = await this.findById(pharmacyId);
    if (!myPharmacy) throw new NotFoundException('Pharmacy not found');

    const pharmacies = await this.pharmacyModel
      .find({
        _id: { $ne: myPharmacy._id },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: myPharmacy.location.coordinates,
            },
            $maxDistance: myPharmacy.notificationRadiusMeter,
          },
        },
      })
      .exec();

    return pharmacies.map((p) => p._id);
  }

  // Find pharmacies whose notificationRadiusMeter covers this pharmacy's location.
  async getNearbyPharmaciesToNotify(pharmacyId: string): Promise<string[]> {
    const myPharmacy = await this.findById(pharmacyId);
    if (!myPharmacy) throw new NotFoundException('Pharmacy not found');

    // Step 1: Broad query (e.g. 50km search window to avoid scanning all)
    const MAX_SEARCH_RADIUS = 50000; // 50km, adjust if needed

    const candidates = await this.pharmacyModel
      .find({
        _id: { $ne: myPharmacy._id },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: myPharmacy.location.coordinates,
            },
            $maxDistance: MAX_SEARCH_RADIUS,
          },
        },
      })
      .exec();

    // Step 2: Filter based on each pharmacy’s radius
    return candidates
      .filter((p) => {
        const distance = geolib.getDistance(
          {
            latitude: myPharmacy.location.coordinates[1],
            longitude: myPharmacy.location.coordinates[0],
          },
          {
            latitude: p.location.coordinates[1],
            longitude: p.location.coordinates[0],
          },
        );
        return distance <= p.notificationRadiusMeter;
      })
      .map((p) => p._id.toString());
  }
}

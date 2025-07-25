import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { RegisterPharmacyDto } from './dto/register-pharmacy.dto';
import { LoginPharmacyDto } from './dto/login-pharmacy.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('pharmacy')
@ApiTags('Pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('register')
  @ApiOperation({ summary: 'Pharmacy Register' })
  @ApiBody({ type: RegisterPharmacyDto })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  async register(@Body() dto: RegisterPharmacyDto) {
    try {
      const { pharmacy, token } = await this.pharmacyService.register(dto);
      return {
        message: 'Pharmacy registered successfully',
        pharmacy: {
          id: pharmacy._id,
          name: pharmacy.name,
          email: pharmacy.email,
          phone: pharmacy.phone,
        },
        token,
      };
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new BadRequestException(
          'Short code already exists, please try again',
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Pharmacy Login' })
  @ApiBody({ type: LoginPharmacyDto })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async login(@Body() dto: LoginPharmacyDto) {
    try {
      const { pharmacy, token } = await this.pharmacyService.login(dto);
      return {
        message: 'Login successful',
        pharmacy: {
          id: pharmacy._id,
          name: pharmacy.name,
          email: pharmacy.email,
          phone: pharmacy.phone,
        },
        token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

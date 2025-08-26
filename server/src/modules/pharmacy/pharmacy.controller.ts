import { Controller, Post, Body, HttpStatus, Param } from '@nestjs/common';
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
    return this.pharmacyService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Pharmacy Login' })
  @ApiBody({ type: LoginPharmacyDto })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async login(@Body() dto: LoginPharmacyDto) {
    return await this.pharmacyService.login(dto);
  }

  @Post('nearby/:id')
  @ApiOperation({ summary: 'Get Nearby Pharmacies' })
  @ApiResponse({ status: HttpStatus.OK })
  async getNearbyPharmacies(@Param('id') id: string) {
    return this.pharmacyService.getNearbyPharmaciesToListen(id);
  }

  @Post('notify/:id')
  @ApiOperation({ summary: 'Get Nearby Pharmacies to Notify' })
  @ApiResponse({ status: HttpStatus.OK })
  async getNearbyPharmaciesToNotify(@Param('id') id: string) {
    return this.pharmacyService.getNearbyPharmaciesToNotify(id);
  }
}

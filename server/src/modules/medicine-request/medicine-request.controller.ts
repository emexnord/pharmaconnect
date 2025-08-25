import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { MedicineRequestService } from './medicine-request.service';
import { CreateMedicineRequestDto } from './dto/create-request.dto';
import { GetPharmacy } from '../pharmacy/decorators/pharmacy.decorator';
import { Pharmacy } from '../pharmacy/entities/pharmacy.entity';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('medicine-request')
export class RequestController {
  constructor(private readonly requestService: MedicineRequestService) {}

  @Get('pharmacy/:pharmacyId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all active requests for a pharmacy' })
  async getActiveRequests(@Param('pharmacyId') pharmacyId: string) {
    return this.requestService.getActiveRequestsByPharmacy(pharmacyId);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new medicine request' })
  async createRequest(
    @Body() dto: CreateMedicineRequestDto,
    @GetPharmacy() pharmacy: Pharmacy,
  ) {
    return await this.requestService.createMedicineRequest(dto, pharmacy._id);
  }

  @Patch(':id/resolve')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mark a medicine request as resolved' })
  async markAsResolved(@Param('id') id: string) {
    return this.requestService.markAsResolved(id);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cancel a medicine request' })
  async cancelRequest(@Param('id') id: string) {
    return this.requestService.cancelRequest(id);
  }
}

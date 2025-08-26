import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { MedicineRequestService } from './medicine-request.service';
import {
  CreateMedicineRequestDto,
  GetRequestsQueryDto,
} from './dto/create-request.dto';
import { GetPharmacy } from '../pharmacy/decorators/pharmacy.decorator';
import { Pharmacy } from '../pharmacy/entities/pharmacy.entity';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('medicine-request')
export class RequestController {
  constructor(private readonly requestService: MedicineRequestService) {}

  @Get()
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiBearerAuth('access-token')
  async getRequests(
    @GetPharmacy() pharmacy: Pharmacy,
    @Query() query: GetRequestsQueryDto,
  ) {
    return this.requestService.getRequests(pharmacy._id, query);
  }

  @Get('my')
  @ApiBearerAuth('access-token')
  async getMyRequests(@GetPharmacy() pharmacy: Pharmacy) {
    console.log('id', pharmacy._id);
    return this.requestService.getMyRequests(pharmacy._id);
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

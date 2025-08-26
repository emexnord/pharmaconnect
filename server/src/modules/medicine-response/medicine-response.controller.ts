import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { MedicineResponseService } from './medicine-response.service';
import { CreateMedicineResponseDto } from './dto/create-response.dto';
import { ResponseType } from './entities/medicine-response.type';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('medicine-response')
export class MedicineResponseController {
  constructor(
    private readonly medicineResponseService: MedicineResponseService,
  ) {}

  @Post()
  @ApiBody({ type: CreateMedicineResponseDto })
  async createResponse(@Body() dto: CreateMedicineResponseDto) {
    return this.medicineResponseService.createResponse(
      dto.requestId,
      dto.responderId,
      dto.response,
      dto.note,
    );
  }

  @Get(':requestId')
  @ApiParam({ name: 'requestId', type: String })
  @ApiQuery({ name: 'responseType', enum: ResponseType, required: false })
  async getResponses(
    @Param('requestId') requestId: string,
    @Query('responseType') responseType?: ResponseType,
  ) {
    return this.medicineResponseService.getResponses(requestId, responseType);
  }
}

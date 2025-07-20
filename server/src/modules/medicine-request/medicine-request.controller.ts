import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestService } from './medicine-request.service';
import { CreateMedicineRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { SocketGateway } from '../socket/socket.gateway';

@Controller('medicine-request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly SocketGateway: SocketGateway,
  ) {}

  @Post()
  async createRequest(@Body() dto: CreateMedicineRequestDto) {
    const new_request = await this.requestService.createMedicineRequest(dto);
    console.log('New request created:', new_request);
    if (!new_request) {
      return { success: false, message: 'Failed to create request' };
    }

    // After storing, emit to nearby pharmacies
    this.SocketGateway.broadcastRequestToNearby({
      medicineName: new_request.medicineName,
      latitude: 0,
      longitude: 0,
      pharmacyId: new_request.pharmacy.toString(),
    });
    return new_request;
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}

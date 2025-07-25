import { Module } from '@nestjs/common';
import { RequestController } from './medicine-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicineRequest,
  MedicineRequestSchema,
} from './entities/medicine-request.entity';
import { SocketModule } from '../socket/socket.module';
import { MedicineRequestService } from './medicine-request.service';
import { PharmacyModule } from '../pharmacy/pharmacy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineRequest.name, schema: MedicineRequestSchema },
    ]),
    SocketModule,
    PharmacyModule,
  ],
  controllers: [RequestController],
  providers: [MedicineRequestService],
})
export class MedicineRequestModule {}

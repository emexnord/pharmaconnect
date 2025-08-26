import { Module } from '@nestjs/common';
import { MedicineResponseController } from './medicine-response.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PharmacyModule } from '../pharmacy/pharmacy.module';
import {
  MedicineResponse,
  MedicineResponseSchema,
} from './entities/medicine-response.entity';
import { MedicineResponseService } from './medicine-response.service';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineResponse.name, schema: MedicineResponseSchema },
    ]),
    SocketModule,
    PharmacyModule,
  ],
  controllers: [MedicineResponseController],
  providers: [MedicineResponseService],
})
export class MedicineResponseModule {}

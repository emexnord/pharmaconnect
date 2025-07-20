import { Module } from '@nestjs/common';
import { RequestService } from './medicine-request.service';
import { RequestController } from './medicine-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicineRequest,
  MedicineRequestSchema,
} from './entities/medicine-request.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineRequest.name, schema: MedicineRequestSchema },
    ]),
    SocketModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}

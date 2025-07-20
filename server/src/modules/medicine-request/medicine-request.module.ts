import { Module } from '@nestjs/common';
import { RequestService } from './medicine-request.service';
import { RequestController } from './medicine-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineRequest } from './entities/medicine-request.entity';
import { MedicineSchema } from '../medicine/entities/medicine.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineRequest.name, schema: MedicineSchema },
    ]),
    SocketModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestModule } from './modules/medicine-request/medicine-request.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { MedicineModule } from './modules/medicine/medicine.module';
import { ResponseModule } from './modules/response/response.module';
import { SocketModule } from './modules/socket/socket.module';
import { DatabaseModule } from './modules/db/db.module';

@Module({
  imports: [
    DatabaseModule,
    RequestModule,
    PharmacyModule,
    MedicineModule,
    ResponseModule,
    SocketModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

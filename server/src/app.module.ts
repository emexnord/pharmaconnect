import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { MedicineModule } from './modules/medicine/medicine.module';
import { ResponseModule } from './modules/response/response.module';
import { SocketModule } from './modules/socket/socket.module';
import { DatabaseModule } from './modules/db/db.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { MedicineRequestModule } from './modules/medicine-request/medicine-request.module';

@Module({
  imports: [
    DatabaseModule,
    MedicineRequestModule,
    PharmacyModule,
    MedicineModule,
    ResponseModule,
    SocketModule,
    JwtModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { MedicineModule } from './modules/medicine/medicine.module';
import { SocketModule } from './modules/socket/socket.module';
import { DatabaseModule } from './modules/db/db.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { MedicineRequestModule } from './modules/medicine-request/medicine-request.module';
import { MedicineResponseModule } from './modules/medicine-response/medicine-response.module';

@Module({
  imports: [
    DatabaseModule,
    MedicineRequestModule,
    PharmacyModule,
    MedicineModule,
    MedicineResponseModule,
    SocketModule,
    JwtModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

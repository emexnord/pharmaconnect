import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { JwtModule } from '../jwt/jwt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PharmacySchema } from './entities/pharmacy.entity';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: 'Pharmacy', schema: PharmacySchema }]),
  ],
  controllers: [PharmacyController],
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}

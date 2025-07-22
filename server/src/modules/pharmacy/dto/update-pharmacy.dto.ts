import { PartialType } from '@nestjs/mapped-types';
import { CreatePharmacyDto } from './register-pharmacy.dto';

export class UpdatePharmacyDto extends PartialType(CreatePharmacyDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineRequestDto } from './create-request.dto';

export class UpdateRequestDto extends PartialType(CreateMedicineRequestDto) {}

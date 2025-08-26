import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineResponseDto } from './create-response.dto';

export class UpdateResponseDto extends PartialType(CreateMedicineResponseDto) {}

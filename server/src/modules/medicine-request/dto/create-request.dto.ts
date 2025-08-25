import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMedicineRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  medicineName: string;

  @ApiProperty()
  @IsOptional()
  isUrgent?: boolean;
}

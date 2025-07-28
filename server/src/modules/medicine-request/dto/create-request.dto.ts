import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMedicineRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  medicineName: string;

  @ApiProperty()
  @IsNotEmpty()
  pharmacyId: string;

  @ApiProperty()
  isUrgent?: boolean;
}

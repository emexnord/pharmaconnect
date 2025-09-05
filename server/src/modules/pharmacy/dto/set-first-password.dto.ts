import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetFirstPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  pharmacyId: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

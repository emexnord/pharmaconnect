import { ApiProperty } from '@nestjs/swagger';

export class LoginPharmacyDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;
}

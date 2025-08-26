import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ResponseType } from '../entities/medicine-response.type';

export class CreateMedicineResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty()
  @IsNotEmpty()
  responderId: string;

  @ApiProperty({ enum: ResponseType })
  @IsEnum(ResponseType)
  response: ResponseType;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  note?: string;
}

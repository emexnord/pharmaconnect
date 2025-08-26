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

export class GetRequestsQueryDto {
  @ApiProperty({ example: 1, description: 'Page number' })
  @IsOptional()
  page: number;

  @ApiProperty({ example: 10, description: 'Number of results per page' })
  @IsOptional()
  limit: number;
}

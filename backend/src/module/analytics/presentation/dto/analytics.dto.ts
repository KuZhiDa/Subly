import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export enum CalculationPeriod {
  MONTH = 1,
  QUARTER = 3,
  HALF_YEAR = 6,
  YEAR = 12,
}

export class HistoryDto {
  @ApiProperty({
    description: 'Месяц за который нужна аналитика.',
    example: '2026-12',
    type: String,
  })
  @IsString({ message: 'Дата должна быть строкой' })
  @Matches(/^\d{4}(-\d{2})?$/, { message: 'Дата должна быть вида YYYY-MM' })
  date: string;
}

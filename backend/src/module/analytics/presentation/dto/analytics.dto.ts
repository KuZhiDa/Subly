import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({
    description: 'Месяц за который нужна аналитика.',
    example: '2026-12',
    type: String,
  })
  @IsString({ message: 'Дата должна быть строкой' })
  @Matches(/^\d{4}-\d{2}/, { message: 'Дата должна быть вида YYYY-MM' })
  date?: string;
}

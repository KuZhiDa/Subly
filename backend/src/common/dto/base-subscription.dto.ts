import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  MaxDate,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Period } from 'src/infrastructure/database/generated/prisma/enums';
import { LastPaymentAtValidation } from '../validator/last-payment-at.validator';

export class BaseSubscriptionDto {
  @ApiProperty({
    description: 'Цена подписки, которую заплатил.',
    example: 299,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Сумма оплаты должно быть числом.' },
  )
  @Min(0, { message: 'Цена не может быть меньше 0.' })
  amountLast: number;

  @ApiProperty({
    description: 'Дата последней оплаты/дата подключения.',
    example: '2026-12-01',
  })
  @Type(() => Date)
  @IsDate({ message: 'Поле last_payment_at должно быть датой.' })
  @Validate(LastPaymentAtValidation)
  last_payment_at: Date;

  @ApiProperty({
    description: 'Период действия.',
    example: Period.WEEK,
  })
  @IsEnum(Period, { message: 'Поле period должно быть соответствующего типа.' })
  period: Period;

  @ApiPropertyOptional({
    description: 'Количество периодов подписки.',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Количество должно быть целым числом.' })
  @Min(1, { message: 'Количество не может быть меньше 1.' })
  count?: number;

  @ApiPropertyOptional({
    description: 'Цена подписки, которую нужно заплатить.',
    example: 299,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Сумма оплаты должно быть числом.' },
  )
  @Min(0, { message: 'Цена не может быть меньше 0.' })
  amountNext?: number;
}

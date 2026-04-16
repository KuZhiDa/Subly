import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';
import { Login, Period } from 'src/database/generated/prisma/enums';

export class AccountSubscriptionDto {
  @ApiProperty({ description: 'Тип логина', example: Login.PHONE_NUMBER })
  @IsEnum(Login, { message: 'Поле login должно быть из списка значений.' })
  type_login: Login;

  @ApiPropertyOptional({ example: '+79991234567' })
  @ValidateIf((dto) => dto.type_login === Login.PHONE_NUMBER)
  @IsString()
  number?: string;

  @ApiPropertyOptional({ example: 'test@mail.com' })
  @ValidateIf((dto) => dto.type_login === Login.EMAIL)
  @IsEmail({}, { message: 'Некорректный email.' })
  email?: string;

  @ApiPropertyOptional({ example: 'my_login_123' })
  @ValidateIf((dto) => dto.type_login === Login.SET_SYMBOL)
  @IsString()
  set_symbol?: string;
}

export class CreateSubscriptionDto extends AccountSubscriptionDto {
  @ApiProperty({
    description: 'Имя подписки.',
    example: 'Яндекс музыка.',
  })
  @IsString({ message: 'Имя должно быть строкой.' })
  @Length(1, 100, { message: 'Имя должно содержать от 1 до 100 символов' })
  name: string;

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
  last_payment_at: Date;

  @ApiProperty({
    description: 'Период действия.',
    example: Period.WEEK,
  })
  @IsEnum(Period, { message: 'Поле period должно быть соответствующего типа.' })
  period: Period;

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

  @ApiPropertyOptional({
    description: 'Ссылка на сайт где была приобретена подписка.',
    example: 'http://yandex.ru',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL.' })
  url?: string;

  @ApiPropertyOptional({
    description: 'Количество периодов подписки.',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Количество должно быть целым числом.' })
  @Min(1, { message: 'Количество не может быть меньше 1.' })
  count?: number;
}

export class UpdateSubscriptionDto extends PartialType(AccountSubscriptionDto) {
  @ApiPropertyOptional({
    description: 'Имя подписки.',
    example: 'Netflix',
  })
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой.' })
  @Length(1, 100, { message: 'Имя должно содержать от 1 до 100 символов' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Ссылка на сайт где была приобретена подписка.',
    example: 'http://yandex.ru',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL.' })
  url?: string;

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

  @ApiPropertyOptional({
    description: 'Цена подписки, которую заплатил.',
    example: 299,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Сумма оплаты должно быть числом.' },
  )
  @Min(0, { message: 'Цена не может быть меньше 0.' })
  amountPayment?: number;

  @ApiPropertyOptional({
    description: 'Период действия.',
    example: Period.WEEK,
  })
  @IsOptional()
  @IsEnum(Period, { message: 'Поле period должно быть соответствующего типа.' })
  period?: Period;

  @ApiPropertyOptional({
    description: 'Количество периодов подписки.',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Количество должно быть целым числом.' })
  @Min(1, { message: 'Количество не может быть меньше 1.' })
  count?: number;
}

import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client/extension';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';
import { BaseSubscriptionDto } from 'src/common/dto/base-subscription.dto';
import {
  Category,
  Login,
  StatusSubscription,
} from 'src/infrastructure/database/generated/prisma/enums';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

export class CategoriesDto {
  @ApiProperty({
    description: 'Категории подписок',
    example: [Category.CINEMA, Category.EDUCATION],
  })
  @IsEnum(Category, {
    each: true,
    message:
      'Категории должны быть из списка значений: ' + Object.values(Category),
  })
  categories: Category[];
}

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

export class CreateSubscriptionDto extends IntersectionType(
  AccountSubscriptionDto,
  CategoriesDto,
  BaseSubscriptionDto,
) {
  @ApiProperty({
    description: 'Имя подписки.',
    example: 'Яндекс музыка.',
  })
  @IsString({ message: 'Имя должно быть строкой.' })
  @Length(1, 100, { message: 'Имя должно содержать от 1 до 100 символов' })
  name: string;

  @ApiPropertyOptional({
    description: 'Ссылка на сайт где была приобретена подписка.',
    example: 'http://yandex.ru',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL.' })
  url?: string;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}

export class CreatePaidDto extends PartialType(BaseSubscriptionDto) {}

class FiltersDto {
  @ApiProperty({ description: 'Столбец фильтрации.', type: String })
  filterColumn: string;

  @ApiPropertyOptional({
    description: 'Фильтрация по константному значению.',
    type: [String],
  })
  constant?: (StatusSubscription | Category)[];

  @ApiPropertyOptional({
    description: 'Фильтрация по части строки.',
    type: [String],
  })
  value?: string[];
}

class SortsDto {
  @ApiProperty({ description: 'Столбец сортировки.', type: String })
  sortsColumn: string;

  @ApiPropertyOptional({ description: 'Порядок сортировки.', type: String })
  by?: 'asc' | 'desc' = 'asc';
}

export class QueryDto {
  @ApiPropertyOptional({ description: 'Фильтрация.', type: [FiltersDto] })
  @Transform(({ value }) => {
    const data = Array.isArray(value) ? value : [value];

    const result = data.map((d) => {
      return JSON.parse(d);
    });

    return result;
  })
  filters?: FiltersDto[];

  @ApiPropertyOptional({ description: 'Сортировка.', type: [SortsDto] })
  @Transform(({ value }) => {
    const data = Array.isArray(value) ? value : [value];

    const result = data.map((d) => {
      return JSON.parse(d);
    });

    return result;
  })
  sorts?: SortsDto[];
}

import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';
import { BaseSubscriptionDto } from 'src/common/dto/base-subscription.dto';
import { Category, Login } from 'src/database/generated/prisma/enums';

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

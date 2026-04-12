import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateDto {
  @ApiPropertyOptional({
    description: 'Email пользователя',
    example: 'dimasik06@yand.ru',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Строка должна соответствовать email.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Пароль',
    example: 'Dimochka20@',
    maxLength: 16,
    minLength: 8,
  })
  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой.' })
  @Length(8, 16, { message: 'Пароль должен иметь длину от 8 до 16 символов.' })
  @Matches(/^[A-Za-z0-9!@#$%^&*()_+={}[\]\|\:;"\'<>,.?\/~]+$/, {
    message:
      'Пароль должен состоять из букв латинского алфавита, цифр и символов из списка [!@#$%^&*()_+={}[]|:;\"\'<>,.?/~]',
  })
  @Matches(
    /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+={}[\]\|\:;\"\'<>,.?\/~])/,
    {
      message:
        'Пароль должен содержать хотя бы одну заглавную и одну строчную буквы, цифру и символ из списка [!@#$%^&*()_+={}[]|:;\"\'<>,.?/~]',
    },
  )
  password?: string;

  @ApiPropertyOptional({
    description: 'Флаг двухфакторной аутентификации.',
    example: false,
  })
  @IsOptional()
  @IsBoolean({
    message: 'Флаг двухфакторной аутентификации должен быть булевым значением',
  })
  is_2fa_auth?: boolean;
}

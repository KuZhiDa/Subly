import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEmail, Matches, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'dimasik06@yand.ru',
  })
  @IsEmail({}, { message: 'Строка должна соответствовать email.' })
  email: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'Dimochka20@',
    maxLength: 16,
    minLength: 8,
  })
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
  password: string;

  @ApiProperty({
    description: 'Флаг двухфакторной аутентификации.',
    example: false,
  })
  @IsBoolean({
    message: 'Флаг двухфакторной аутентификации должен быть булевым значением',
  })
  is_2fa_auth: boolean;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'dimasik06@yand.ru',
  })
  @IsEmail({}, { message: 'Строка должна соответствовать email.' })
  email: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'Dimochka20@',
  })
  @IsString({ message: 'Пароль должен быть строкой.' })
  password: string;
}

export class TokenDto {
  @ApiProperty({
    description: 'Токен',
  })
  @IsString()
  token: string;
}

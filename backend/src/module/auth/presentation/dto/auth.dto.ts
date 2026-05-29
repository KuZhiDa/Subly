import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { BaseUserDto } from 'src/common/dto/base-user.dto';

export class LoginDto extends BaseUserDto {}

export class RegisterDto extends BaseUserDto {
  @ApiProperty({
    description: 'Флаг двухфакторной аутентификации.',
    example: false,
  })
  @IsBoolean({
    message: 'Флаг двухфакторной аутентификации должен быть булевым значением',
  })
  is_2fa_auth: boolean;
}

import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { BaseUserDto } from 'src/common/dto/base-user.dto';

export class UpdateDto extends PartialType(BaseUserDto) {
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

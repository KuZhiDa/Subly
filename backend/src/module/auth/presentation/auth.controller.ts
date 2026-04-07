import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../use-cases/auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Авторизация/Регистрация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Регистрация пользователя через email и пароль.',
  })
  @ApiBody({
    type: RegisterDto,
    description:
      'Данные регистрации (email, password, флаг двухфакторной аутентификации',
  })
  async registerUser(@Body() dto: RegisterDto) {
    return await this.authService.registerUser(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Авторизация через гугл' })
  async googleOAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Колл-бэк после авторизации' })
  async googleOAuthCallback(@Req() req: any, @Res() res: any) {
    const email = req.user;
    res.redirect(`http://localhost:5000?user=${email}`);
  }
}

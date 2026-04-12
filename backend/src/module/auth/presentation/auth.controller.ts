import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../use-case/auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Cookies } from 'src/common/decorator/cookie.decorator';

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

  @Post('login')
  @ApiOperation({
    summary: 'Вход пользователя по личным данным.',
  })
  @ApiBody({
    description: 'Данные для входа (email и пароль).',
    type: LoginDto,
  })
  async loginUser(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const { accessToken, refreshToken } = await this.authService.loginUser(dto);
    res.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('logout')
  @ApiOperation({
    summary: 'Выход из аккаунта.',
  })
  async logoutUser(
    @Cookies('token') token: string,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.logoutUser(token);
    res.clearCookie('token');
    return result;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Авторизация через гугл.' })
  async googleOAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Колл-бэк после авторизации.' })
  async googleOAuthCallback(@Req() req: any, @Res() res: any) {
    const { accessToken, refreshToken } = await this.authService.genTokens({
      id: req.user.id,
      email: req.user.email,
    });
    res.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`http://localhost:5000?user=${accessToken}`);
  }

  @Put('refresh')
  @ApiOperation({ summary: 'Обновление access токена.' })
  async accessRefresh(
    @Cookies('token') token: string,
    @Res({ passthrough: true }) res: any,
  ) {
    try {
      const accessToken = await this.authService.accessRefresh(token);
      return { accessToken };
    } catch (e) {
      res.clearCookie('token');
      throw e;
    }
  }
}

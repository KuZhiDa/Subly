import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from '../presentation/dto/auth.dto';
import { PrismaService } from 'src/database/prisma.service';
import { SecretService } from '../../../common/service/secret.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private secretService: SecretService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const user = await this.checkUser(dto.email);

    if (user) {
      throw new BadRequestException('Такой пользователь уже создан.');
    }

    const password_hash = await this.secretService.hashPassword(dto.password);

    delete dto.password;
    const data = { ...dto, password_hash };

    return this.prisma.user.create({ data });
  }

  async loginUser(dto: LoginDto) {
    const user = await this.checkUser(dto.email);

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует.');
    }

    await this.secretService.verifyPassword(dto.password, user.password_hash);

    return this.genTokens({ id: user.id, email: user.email });
  }

  async logoutUser(token: string) {
    return this.deleteTokenRefresh(token);
  }

  async validateUser(email: string) {
    let user = await this.checkUser(email);

    if (!user) {
      user = await this.prisma.user.create({
        data: { email, password_hash: '' },
      });
    }

    return { id: user.id, email: user.email };
  }

  async checkUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async genTokens(data: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.secretService.genJwtTokenAccess({ id: data.id, email: data.email }),
      this.secretService.genJwtTokenRefresh({ id: data.id, email: data.email }),
    ]);

    await this.refreshSave(data.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshSave(id: string, refreshToken: string) {
    const token_hash = await this.secretService.hashToken(refreshToken);

    return this.prisma.tokenRefresh.create({
      data: { user_id: id, token_hash },
    });
  }

  async deleteTokenRefresh(token: string) {
    const { id, tokenHash } = await this.checkRefreshToken(token);

    return this.prisma.tokenRefresh.deleteMany({
      where: { user_id: id, token_hash: tokenHash },
    });
  }

  async accessRefresh(token: string) {
    const { id, email } = await this.verifyToken(token);

    return this.secretService.genJwtTokenAccess({
      id,
      email,
    });
  }

  async verifyToken(token: string) {
    try {
      const { id, email } = await this.checkRefreshToken(token);

      await this.secretService.verifyToken(token);

      return { id, email };
    } catch (e: any) {
      if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError') {
        await this.deleteTokenRefresh(token);
      }
      throw new UnauthorizedException('Ошибка токена.');
    }
  }

  async checkRefreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('В куках нет токена.');
    }

    const { id, email } = await this.secretService.decodeToken(token);

    const tokenHash = await this.secretService.hashToken(token);

    const tokenBd = await this.prisma.tokenRefresh.findFirst({
      where: { user_id: id, token_hash: tokenHash },
    });

    if (!tokenBd) {
      throw new UnauthorizedException('Нет токена в бд.');
    }

    return { id, email, tokenHash };
  }
}

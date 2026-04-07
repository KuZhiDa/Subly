import { BadRequestException, Global, Injectable } from '@nestjs/common';
import { RegisterDto } from '../presentation/dto/register.dto';
import { PrismaService } from 'src/database/prisma.service';
import { SecretService } from '../../../common/secret.service';

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

    const password_hash = await this.secretService.hashString(dto.password);

    delete dto.password;
    const data = { ...dto, password_hash };

    return this.prisma.user.create({ data });
  }

  async validateUser(email: string) {
    const user = await this.checkUser(email);

    if (!user) {
      this.prisma.user.create({ data: { email, password_hash: '' } });
    }

    return email;
  }

  async checkUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}

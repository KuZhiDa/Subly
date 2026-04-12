import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserService } from './user.service.interface';
import { UpdateDto } from '../presentation/dto/update.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  async getOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Такого пользователя нет.');
    }

    return {
      email: user.email,
      is2FaAuth: user.is_2fa_auth,
    };
  }

  async update(id: string, dto: UpdateDto) {
    const data: any = {};

    if (dto.email) {
      data.email = dto.email;
    }

    if (dto.password) {
      data.password = dto.password;
    }

    if (dto.is_2fa_auth !== undefined) {
      data.is_2fa_auth = dto.is_2fa_auth;
    }

    await this.getOne(id);

    return this.prisma.user.update({ where: { id: id }, data });
  }
}

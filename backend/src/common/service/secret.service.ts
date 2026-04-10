import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class SecretService {
  private readonly salt: number;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.salt = configService.getOrThrow<number>('SALT');
  }

  async hashPassword(password: string) {
    const saltOrRounds = Number(this.salt);
    return bcrypt.hash(password, saltOrRounds);
  }

  async verifyPassword(password: string, password_hash: string) {
    const result = await bcrypt.compare(password, password_hash);
    if (!result) {
      throw new ForbiddenException('Не верный пароль.');
    }
    return result;
  }

  async hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('base64');
  }

  async genJwtTokenAccess(data: any) {
    const expires = this.configService.getOrThrow<string>('EXPIRES_ACCESS');
    return this.jwtService.signAsync(data, {
      expiresIn: Number(expires),
    });
  }

  async genJwtTokenRefresh(data: any) {
    const expires = this.configService.getOrThrow<string>('EXPIRES_REFRESH');
    return this.jwtService.signAsync(data, {
      expiresIn: Number(expires),
    });
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}

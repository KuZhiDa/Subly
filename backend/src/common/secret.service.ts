import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecretService {
  private readonly secretKey: string;
  private readonly salt: number;

  constructor(private configService: ConfigService) {
    this.secretKey = configService.getOrThrow<string>('SECRET_KEY');
    this.salt = configService.getOrThrow<number>('SALT');
  }

  async hashString(input: string) {
    const saltOrRounds = Number(this.salt);
    return bcrypt.hash(input, saltOrRounds);
  }
}

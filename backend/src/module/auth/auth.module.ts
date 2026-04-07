import { Module } from '@nestjs/common';
import { AuthService } from './use-cases/auth.service';
import { AuthController } from '../auth/presentation/auth.controller';
import { SecretService } from 'src/common/secret.service';
import { PrismaService } from 'src/database/prisma.service';
import { GoogleOAuthStrategy } from 'src/common/strategy/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SecretService, GoogleOAuthStrategy],
})
export class AuthModule {}

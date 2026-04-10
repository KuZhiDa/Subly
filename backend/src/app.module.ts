import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { configJwt } from './common/config/jwt.config';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    AuthModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: configJwt,
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}

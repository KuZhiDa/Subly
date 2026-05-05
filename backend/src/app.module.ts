import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { configJwt } from './common/config/jwt.config';
import { UserModule } from './module/user/user.module';
import { SubscriptionModule } from './module/subscription/subscription.module';
import { BullModule } from '@nestjs/bullmq';
import { configBull } from './common/config/bull.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './module/notification/notification.module';
import { QueueModule } from './infrastructure/queue/queue.module';

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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: configBull,
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({ global: true }),
    UserModule,
    SubscriptionModule,
    QueueModule,
    NotificationModule,
  ],
})
export class AppModule {}

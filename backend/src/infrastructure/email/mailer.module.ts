import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { mailerConfig } from 'src/common/config/mailer.config';

@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [EmailService],
})
export class EmailModule {}

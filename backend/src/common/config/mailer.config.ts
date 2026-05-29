import { ConfigService } from '@nestjs/config';

export function mailerConfig(configService: ConfigService) {
  return {
    transport: {
      host: configService.get<string>('HOST_MAILER'),
      port: Number(configService.get<number>('PORT_MAILER')),
      auth: {
        user: configService.get<string>('USER_MAILER'),
        pass: configService.get<string>('PASS_MAILER'),
      },
    },
  };
}

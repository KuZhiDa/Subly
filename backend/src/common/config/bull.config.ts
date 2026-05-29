import { ConfigService } from '@nestjs/config';

export function configBull(configService: ConfigService) {
  return {
    connection: {
      host: configService.getOrThrow<string>('HOST_REDIS'),
      port: Number(configService.getOrThrow<string>('PORT_REDIS')),
    },
  };
}

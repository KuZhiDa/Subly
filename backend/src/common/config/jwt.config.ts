import { ConfigService } from '@nestjs/config';

export async function configJwt(configService: ConfigService) {
  return {
    secret: configService.getOrThrow<string>('SECRET_KEY'),
    signOption: {
      algorithm: 'HS256',
    },
    verifyOption: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}

import { Module } from '@nestjs/common';
import { UserService } from './use-case/user.service';
import { UserController } from './presentation/user.controller';
import { SecretService } from 'src/common/service/secret.service';

@Module({
  controllers: [UserController],
  providers: [UserService, SecretService],
})
export class UserModule {}

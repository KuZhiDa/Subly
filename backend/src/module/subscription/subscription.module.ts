import { Module } from '@nestjs/common';
import { SubscriptionService } from './use-case/subscription.service';
import { SubscriptionController } from './presentation/subscription.controller';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}

import { Module } from '@nestjs/common';
import { SubscriptionService } from './uses-cases/subscription/subscription.service';
import { SubscriptionController } from './presentation/subscription.controller';
import { PaymentService } from './uses-cases/payment/payment.service';
import { CategoriesService } from './uses-cases/categories/categories.service';
import { QueueModule } from '../../infrastructure/queue/queue.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PaymentService, CategoriesService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}

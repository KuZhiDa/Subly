import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CheckSubscriptionsWorker } from './workers/check-subscriptions.worker';
import { SubscriptionModule } from '../../module/subscription/subscription.module';
import { NotificationWorker } from './workers/notification.worker';
import { CheckSubscriptionQueueService } from './services/check-subscription.queue.service';
import { NotificationQueueService } from './services/notification.queue.service';

@Module({
  providers: [
    CheckSubscriptionsWorker,
    NotificationWorker,
    CheckSubscriptionQueueService,
    NotificationQueueService,
  ],
  imports: [
    BullModule.registerQueue(
      {
        name: 'check_subscriptions',
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      },
      {
        name: 'notifications',
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      },
    ),
    SubscriptionModule,
  ],
  exports: [BullModule],
})
export class QueueModule {}

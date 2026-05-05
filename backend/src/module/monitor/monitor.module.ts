import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitorService } from './monitor.service';
import { CheckSubscriptionsWorker } from './workers/check-subscriptions.worker';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NotificationModule } from '../notification/notification.module';
import { NotificationWorker } from './workers/notification.worker';

@Module({
  providers: [MonitorService, CheckSubscriptionsWorker, NotificationWorker],
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
    ScheduleModule.forRoot(),
    SubscriptionModule,
  ],
})
export class MonitorModule {}

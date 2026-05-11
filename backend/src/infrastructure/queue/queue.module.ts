import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ExpiredSubscriptionWorker } from './workers/expired-subscriptions.worker';
import { SubscriptionModule } from '../../module/subscription/subscription.module';
import { CreateNotificationsWorker } from './workers/create-notifications.worker';
import { CheckSubscriptionsQueueService } from './services/check-subscriptions.queue.service';
import { NotificationsQueueService } from './services/notifications.queue.service';
import { EmailModule } from '../email/mailer.module';
import { optionsQueue } from 'src/common/const/queue.options';
import { DeadlineSubscriptionWorker } from './workers/deadline-subscriptions.worker';
import { SendNotificationsWorker } from './workers/send-notifications.worker';

@Module({
  providers: [
    ExpiredSubscriptionWorker,
    DeadlineSubscriptionWorker,
    CreateNotificationsWorker,
    SendNotificationsWorker,

    CheckSubscriptionsQueueService,
    NotificationsQueueService,
  ],
  imports: [
    BullModule.registerQueue(
      {
        name: 'expired_subscriptions',
        defaultJobOptions: optionsQueue,
      },
      {
        name: 'deadline_subscriptions',
        defaultJobOptions: optionsQueue,
      },
      {
        name: 'create_notifications',
        defaultJobOptions: optionsQueue,
      },
      {
        name: 'send_notifications',
        defaultJobOptions: optionsQueue,
      },
    ),
    SubscriptionModule,
    EmailModule,
  ],
  exports: [BullModule],
})
export class QueueModule {}

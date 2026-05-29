import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';

@Injectable()
export class MonitorService {
  constructor(
    @InjectQueue('expired_subscriptions')
    private expiredSubscriptionsQueue: Queue,
    @InjectQueue('deadline_subscriptions')
    private deadlineSubscriptionQueue: Queue,
    @InjectQueue('send_notifications') private sendNotificationsQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async expiredSubscriptions() {
    await this.expiredSubscriptionsQueue.add('expired_subscriptions', {});
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deadlineSubscriptions() {
    await this.deadlineSubscriptionQueue.add('deadline_subscriptions', {});
  }

  @Cron('0 0 10 * * 1,5')
  async sendNotifications() {
    await this.sendNotificationsQueue.add('send_all_notifications', {});
  }
}

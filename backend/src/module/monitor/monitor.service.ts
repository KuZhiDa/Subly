import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';

@Injectable()
export class MonitorService {
  constructor(
    @InjectQueue('check_subscriptions') private checkSubscriptionsQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async monitorSubscriptions() {
    await this.checkSubscriptionsQueue.add('check_subscriptions', {});
  }
}

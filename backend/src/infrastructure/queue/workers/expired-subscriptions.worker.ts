import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CheckSubscriptionsQueueService } from '../services/check-subscriptions.queue.service';

@Processor('expired_subscriptions')
export class ExpiredSubscriptionWorker extends WorkerHost {
  constructor(
    private checkSubscriptionsQueueService: CheckSubscriptionsQueueService,
  ) {
    super();
  }

  async process(job: Job) {
    await this.checkSubscriptionsQueueService.expired();
  }
}

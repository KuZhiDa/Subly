import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CheckSubscriptionQueueService } from '../services/check-subscription.queue.service';

@Processor('check_subscriptions')
export class CheckSubscriptionsWorker extends WorkerHost {
  constructor(
    private checkSubscriptionQueueService: CheckSubscriptionQueueService,
  ) {
    super();
  }

  async process(job: Job) {
    await this.checkSubscriptionQueueService.checkNextPaymentAt();
  }
}

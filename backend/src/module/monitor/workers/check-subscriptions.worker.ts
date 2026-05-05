import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SubscriptionService } from 'src/module/subscription/uses-cases/subscription/subscription.service';

@Processor('check_subscriptions')
export class CheckSubscriptionsWorker extends WorkerHost {
  constructor(private subscriptionService: SubscriptionService) {
    super();
  }

  async process(job: Job) {
    await this.subscriptionService.checkNextPaymentAt();
  }
}

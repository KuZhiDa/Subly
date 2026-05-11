import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CheckSubscriptionsQueueService } from '../services/check-subscriptions.queue.service';

@Processor('deadline_subscriptions')
export class DeadlineSubscriptionWorker extends WorkerHost {
  constructor(
    private checkSubscriptionsQueueService: CheckSubscriptionsQueueService,
  ) {
    super();
  }

  async process(job: Job) {
    await this.checkSubscriptionsQueueService.deadline();
  }
}

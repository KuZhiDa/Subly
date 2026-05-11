import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsQueueService } from '../services/notifications.queue.service';

@Processor('create_notifications')
export class CreateNotificationsWorker extends WorkerHost {
  constructor(private notificationsQueueService: NotificationsQueueService) {
    super();
  }
  async process(job: Job) {
    await this.notificationsQueueService.create(job.data);
  }
}

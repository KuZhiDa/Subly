import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationQueueService } from '../services/notification.queue.service';

@Processor('notifications')
export class NotificationWorker extends WorkerHost {
  constructor(private notificationQueueService: NotificationQueueService) {
    super();
  }
  async process(job: Job) {
    await this.notificationQueueService.createNotifications(job.data);
  }
}

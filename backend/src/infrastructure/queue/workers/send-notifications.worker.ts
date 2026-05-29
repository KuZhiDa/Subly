import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsQueueService } from '../services/notifications.queue.service';

@Processor('send_notifications')
export class SendNotificationsWorker extends WorkerHost {
  constructor(private notificationQueueService: NotificationsQueueService) {
    super();
  }
  async process(job: Job) {
    if (job.name === 'send_deadline_notifications') {
      await this.notificationQueueService.send(job.data);
    }

    if (job.name === 'send_all_notifications') {
      await this.notificationQueueService.get();
    }
  }
}

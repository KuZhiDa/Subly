import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notification')
export class NotificationWorker extends WorkerHost {
  constructor() {
    super();
  }
  async process(job: Job) {}
}

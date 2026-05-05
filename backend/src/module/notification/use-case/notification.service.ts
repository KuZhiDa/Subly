import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { NotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(@InjectQueue('notifications') private notificationQueue: Queue) {}

  @OnEvent('ExpiredSubscription')
  async createNotification(data: NotificationDto) {
    await this.notificationQueue.add('notifications', { data });
  }
}

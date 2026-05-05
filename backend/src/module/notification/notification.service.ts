import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { getMessageForNotification } from 'src/common/const/message';
import { StatusNotification } from 'src/database/generated/prisma/enums';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private emitter: EventEmitter2,
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  @OnEvent('ExpiredSubscription')
  async createNotification(data: any) {
    await this.notificationQueue.add('notification', { data });
  }
}

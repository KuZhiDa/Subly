import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { NotificationDto } from 'src/module/notification/dto/notification.dto';

@Injectable()
export class NotificationQueueService {
  constructor(
    private prisma: PrismaService,
    private emitter: EventEmitter2,
  ) {}

  async createNotifications(data: NotificationDto) {
    console.log(data);
  }
}

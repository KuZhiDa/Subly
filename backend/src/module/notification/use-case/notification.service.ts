import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { NotificationDto } from '../presentation/dto/notification.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { StatusNotification } from 'src/infrastructure/database/generated/prisma/enums';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('create_notifications')
    private createNotificationsQueue: Queue,
    @InjectQueue('send_notifications') private sendNotificationsQueue: Queue,
    private prisma: PrismaService,
  ) {}

  @OnEvent('ExpiredSubscriptions')
  async createNotification(data: NotificationDto[]) {
    await this.createNotificationsQueue.add('create_notifications', data);
  }

  @OnEvent('DeadlineSubscriptions')
  async sendNotification(data: NotificationDto[]) {
    await this.sendNotificationsQueue.add('send_deadline_notifications', data);
  }

  async get(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { user_id: userId },
      select: { id: true, message: true, status: true },
    });

    return notifications;
  }

  async updateStatus(userId: string, notifications: string[]) {
    await this.checkNotifications(userId, notifications);

    return await this.prisma.notification.updateMany({
      where: {
        id: { in: notifications },
        status: { not: StatusNotification.READ },
      },
      data: { status: StatusNotification.READ },
    });
  }

  async delete(userId: string, notifications: string[]) {
    await this.checkNotifications(userId, notifications);

    return this.prisma.notification.deleteMany({
      where: { id: { in: notifications } },
    });
  }

  async checkNotifications(userId: string, notifications: string[]) {
    const notificationsDb = await this.prisma.notification.findMany({
      where: { user_id: userId, id: { in: notifications } },
    });

    if (notificationsDb.length !== notifications.length) {
      throw new BadRequestException('Ошибка входных данных.');
    }
  }
}

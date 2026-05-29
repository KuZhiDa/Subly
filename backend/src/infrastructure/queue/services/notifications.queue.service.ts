import { Injectable } from '@nestjs/common';
import { getMessageForNotification } from 'src/common/const/message';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { EmailService } from 'src/infrastructure/email/email.service';
import { NotificationDto } from 'src/module/notification/presentation/dto/notification.dto';

@Injectable()
export class NotificationsQueueService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(data: NotificationDto[]) {
    await this.prisma.notification.createMany({
      data: data.flatMap((d) =>
        d.subscription.map((s) => {
          return {
            user_id: d.user.id,
            subscription_id: s.id,
            message: getMessageForNotification('ExpiredSubscriptions', s.name),
          };
        }),
      ),
    });
    await this.send(data);
  }

  async get() {
    const notifications = await this.prisma.notification.findMany({
      include: { user: true, subscription: true },
    });

    const groups = notifications.reduce((acc, n) => {
      if (!acc[n.user.id]) {
        acc[n.user.id] = {
          user: { id: n.user.id, email: n.user.email },
          subscription: [],
        };
      }
      acc[n.user.id].subscription.push({
        id: n.subscription.id,
        name: n.subscription.name,
        type: 'ExpiredSubscriptions',
      });
      return acc;
    }, {} as NotificationDto);
    const result = Object.values(groups);
    await this.send(result);
  }

  async send(data: NotificationDto[]) {
    await this.emailService.sendNotifications(data);
  }
}

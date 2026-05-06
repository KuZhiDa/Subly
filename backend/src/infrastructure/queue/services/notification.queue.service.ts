import { Injectable } from '@nestjs/common';
import { getMessageForNotification } from 'src/common/const/message';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class NotificationQueueService {
  constructor(private prisma: PrismaService) {}

  async createNotifications(data: any) {
    await this.prisma.notification.createMany({
      data: data.flatMap((d) =>
        d.subscription.map((s) => {
          return {
            user_id: d.user.id,
            subscription_id: s.id,
            message: getMessageForNotification(s.name),
          };
        }),
      ),
      skipDuplicates: true,
    });
  }
}

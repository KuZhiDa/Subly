import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Subscription,
  User,
} from 'src/infrastructure/database/generated/prisma/client';
import { StatusSubscription } from 'src/infrastructure/database/generated/prisma/enums';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { NotificationDto } from 'src/module/notification/presentation/dto/notification.dto';

@Injectable()
export class CheckSubscriptionsQueueService {
  constructor(
    private prisma: PrismaService,
    private emitter: EventEmitter2,
  ) {}

  async expired() {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        next_payment_at: { lte: new Date() },
        status: StatusSubscription.PAID,
      },
      include: { user: true },
    });

    if (subscriptions?.length) {
      const emit = await this.groupByUsers(
        subscriptions,
        'ExpiredSubscriptions',
      );
      this.emitter.emit('ExpiredSubscriptions', emit);
      await this.prisma.subscription.updateMany({
        where: {
          id: { in: emit.flatMap((e) => e.subscription.map((s) => s.id)) },
        },
        data: { status: StatusSubscription.NOT_PAID },
      });
    }
  }

  async deadline() {
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    const dateOneDay = {
      leftDay: new Date(dateNow.setDate(dateNow.getDate() + 1)),
      rightDay: new Date(dateNow.setDate(dateNow.getDate() + 1)),
    };
    const dateThreeDay = {
      leftDay: new Date(dateNow.setDate(dateNow.getDate() + 1)),
      rightDay: new Date(dateNow.setDate(dateNow.getDate() + 1)),
    };

    const [subscriptionsOneDay, subscriptionsThreeDay] = await Promise.all([
      this.prisma.subscription.findMany({
        where: {
          next_payment_at: {
            gte: dateOneDay.leftDay,
            lt: dateOneDay.rightDay,
          },
        },
        include: { user: true },
      }),
      this.prisma.subscription.findMany({
        where: {
          next_payment_at: {
            gte: dateThreeDay.leftDay,
            lt: dateThreeDay.rightDay,
          },
        },
        include: { user: true },
      }),
    ]);

    let [emitOneDay, emitTreeDay] = await Promise.all([
      subscriptionsOneDay
        ? this.groupByUsers(subscriptionsOneDay, 'BeforeDeadlineOneDay')
        : [],
      subscriptionsThreeDay
        ? this.groupByUsers(subscriptionsThreeDay, 'BeforeDeadlineThreeDay')
        : [],
    ]);

    if (emitOneDay?.length) {
      this.emitter.emit('DeadlineSubscriptions', emitOneDay);
    }
    if (emitTreeDay?.length) {
      this.emitter.emit('DeadlineSubscriptions', emitTreeDay);
    }
  }

  async groupByUsers(
    subscriptions: (Subscription & { user: User })[],
    type: string,
  ) {
    const groups = subscriptions.reduce((acc, s) => {
      if (!acc[s.user.id]) {
        acc[s.user.id] = {
          user: { id: s.user.id, email: s.user.email },
          subscription: [],
        };
      }
      acc[s.user.id].subscription.push({ id: s.id, name: s.name, type });
      return acc;
    }, {} as NotificationDto);

    return Object.values(groups);
  }
}

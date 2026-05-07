import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StatusSubscription } from 'src/infrastructure/database/generated/prisma/enums';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class CheckSubscriptionQueueService {
  constructor(
    private prisma: PrismaService,
    private emitter: EventEmitter2,
  ) {}

  async checkNextPaymentAt() {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        next_payment_at: { lte: new Date() },
        status: StatusSubscription.PAID,
      },
      include: { user: true },
    });
    if (subscriptions?.length) {
      const groups = subscriptions?.reduce(
        (acc, s) => {
          if (!acc[s.user.id]) {
            acc[s.user.id] = {
              user: { id: s.user.id, email: s.user.email },
              subscription: [],
            };
          }
          acc[s.user.id].subscription.push({ id: s.id, name: s.name });
          return acc;
        },
        {} as Record<
          string,
          {
            user: { id: string; email: string };
            subscription: { id: string; name: string }[];
          }
        >,
      );

      const emit = Object.values(groups);

      await this.prisma.subscription.updateMany({
        where: {
          id: { in: emit.flatMap((g) => g.subscription.map((s) => s.id)) },
        },
        data: { status: StatusSubscription.NOT_PAID },
      });
      this.emitter.emit('ExpiredSubscription', emit);
    }
  }
}

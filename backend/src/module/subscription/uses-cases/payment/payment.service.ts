import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PeriodInSetFunc } from 'src/common/const/date-transform';
import {
  Period,
  StatusSubscription,
} from 'src/database/generated/prisma/enums';
import { PrismaService } from 'src/database/prisma.service';
import { IPaymentService } from './payment.service.interface';
import { SubscriptionService } from 'src/module/subscription/uses-cases/subscription/subscription.service';
import { CreatePaidDto } from '../../presentation/dto/subscription.dto';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SubscriptionService))
    private subscriptionService: SubscriptionService,
  ) {}

  async createPayment(
    subscriptionId: string,
    amount: number,
    paymentDate: Date,
  ) {
    return this.prisma.payment.create({
      data: {
        subscription_id: subscriptionId,
        amount: amount,
        payment_date: paymentDate,
      },
    });
  }

  async updateNextPaymentAt(
    lastPaymentAt: Date,
    count: number,
    period: Period,
  ) {
    const next_payment_at: Date = new Date(lastPaymentAt);
    return new Date(PeriodInSetFunc[period](next_payment_at, count ?? 1));
  }

  async updateAmount(
    subscriptionId: string,
    lastPaymentAt: Date,
    amount: number,
  ) {
    return this.prisma.payment.update({
      where: {
        subscription_id_payment_date: {
          subscription_id: subscriptionId,
          payment_date: lastPaymentAt,
        },
      },
      data: {
        amount: amount,
      },
    });
  }

  async paidSubscription(
    userId: string,
    subscriptionId: string,
    dto: CreatePaidDto,
  ) {
    const subscription = await this.subscriptionService.getOne(
      userId,
      subscriptionId,
    );

    if (subscription.status === StatusSubscription.PAID) {
      throw new ForbiddenException('Подписка уже оплачена.');
    }

    await this.createPayment(
      subscription.id,
      dto.amountLast,
      dto.last_payment_at,
    );

    const nextPaymentAt = await this.updateNextPaymentAt(
      dto.last_payment_at,
      dto.count ?? subscription.count,
      dto.period ?? subscription.period,
    );

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        ...dto,
        next_payment_at: nextPaymentAt,
        status: StatusSubscription.PAID,
      },
    });
  }
}

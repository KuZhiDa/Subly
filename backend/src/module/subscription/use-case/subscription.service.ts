import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISubscriptionService } from './subscription.service.interface';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../presentation/dto/subscription.dto';
import { PrismaService } from 'src/database/prisma.service';
import { PeriodInSetFunc } from 'src/common/const/date-transform';
import { Login, Period } from 'src/database/generated/prisma/client';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto, userId: string) {
    const account = await this.accountUpsert(
      dto.type_login,
      dto.email ?? undefined,
      dto.number ?? undefined,
      dto.set_symbol ?? undefined,
      userId,
    );

    const subscriptionInDb = await this.prisma.subscription.findUnique({
      where: {
        user_id_name_account_id: {
          user_id: userId,
          name: dto.name,
          account_id: account.id,
        },
      },
    });

    if (subscriptionInDb) {
      throw new BadRequestException('Такая подписка уже существует.');
    }

    const next_payment_at = await this.nextPaymentAt(
      dto.last_payment_at,
      dto.count,
      dto.period,
    );

    const subscription = await this.prisma.subscription.create({
      data: {
        user_id: userId,
        account_id: account.id,
        last_payment_at: dto.last_payment_at,
        name: dto.name,
        url: dto.url ?? null,
        period: dto.period,
        count: dto.count ?? 1,
        next_payment_at: next_payment_at,
        next_amount: dto.amountNext ?? dto.amountLast,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        subscription_id: subscription.id,
        amount: dto.amountLast,
        payment_date: dto.last_payment_at,
      },
    });

    return { subscription, payment };
  }

  async getAll(userId: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { user_id: userId, deleted_at: null },
      include: { account: true },
    });

    return subscriptions?.map((s) => ({
      id: s.id,
      name: s.name,
      last_payment_at: s.last_payment_at,
      next_payment_at: s.next_payment_at,
    }));
  }

  async getOne(userId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { account: true },
    });

    if (!subscription) {
      throw new NotFoundException('Такой подписки нет.');
    }

    if (subscription.user_id !== userId) {
      throw new ForbiddenException(
        'У вас нет прав просматривать данную подписку.',
      );
    }

    return subscription;
  }

  async update(
    userId: string,
    subscriptionId: string,
    dto: UpdateSubscriptionDto,
  ) {
    const subscription = await this.getOne(userId, subscriptionId);

    if (subscription.deleted_at) {
      throw new BadRequestException('Эта подписка удалена.');
    }

    const data: any = {};

    if (dto.type_login) {
      data.account_id = (
        await this.accountUpsert(
          dto.type_login ?? undefined,
          dto.email ?? undefined,
          dto.number ?? undefined,
          dto.set_symbol ?? undefined,
          userId,
        )
      ).id;
    }

    if (dto.count || dto.period) {
      data.next_payment_at = await this.nextPaymentAt(
        subscription.last_payment_at,
        dto.count ?? subscription.count,
        dto.period ?? subscription.period,
      );
    }

    if (dto.amountNext) {
      data.next_amount = dto.amountNext;
    }

    if (dto.amountPayment) {
      await this.prisma.payment.update({
        where: {
          subscription_id_payment_date: {
            subscription_id: subscriptionId,
            payment_date: subscription.last_payment_at,
          },
        },
        data: {
          amount: dto.amountPayment,
        },
      });
    }

    const {
      type_login,
      email,
      number,
      set_symbol,
      amountNext,
      amountPayment,
      ...result
    } = dto;

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { ...data, ...result },
    });
  }

  async delete(userId: string, subscriptionId: string) {
    const subscription = await this.getOne(userId, subscriptionId);

    if (subscription.deleted_at) {
      return this.prisma.subscription.delete({ where: { id: subscriptionId } });
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { deleted_at: new Date() },
    });
  }

  async accountUpsert(
    type_login: Login,
    email: string,
    number: string,
    set_symbol: string,
    userId: string,
  ) {
    const login =
      type_login === Login.EMAIL
        ? email
        : type_login === Login.PHONE_NUMBER
          ? number
          : set_symbol;

    if (!login) {
      throw new BadRequestException('Некорректные данные аккаунта');
    }

    return this.prisma.subscriptionAccount.upsert({
      where: { user_id_login: { login, user_id: userId } },
      create: { type_login: type_login, login, user_id: userId },
      update: {},
    });
  }

  async nextPaymentAt(last_payment_at: Date, count: number, period: Period) {
    const next_payment_at: Date = new Date(last_payment_at);
    return new Date(PeriodInSetFunc[period](next_payment_at, count ?? 1));
  }
}

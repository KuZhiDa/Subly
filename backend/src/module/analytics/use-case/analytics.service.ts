import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import {
  CalculationPeriod,
  HistoryDto,
} from '../presentation/dto/analytics.dto';
import {
  Period,
  StatusSubscription,
} from 'src/infrastructure/database/generated/prisma/enums';
import { PaymentService } from 'src/module/subscription/uses-cases/payment/payment.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  async getHistory(query: HistoryDto, userId: string) {
    const inputDate = {
      year: Number(query.date.split('-')[0]),
      month: Number(query.date.split('-')[1]) ?? 0,
    };
    const betweenDate = {
      leftDate: inputDate.month
        ? new Date(Date.UTC(inputDate.year, inputDate.month - 1, 1, 0, 0, 0, 0))
        : new Date(Date.UTC(inputDate.year, 0, 1, 0, 0, 0, 0)),
      rightDate: inputDate.month
        ? new Date(Date.UTC(inputDate.year, inputDate.month, 1, 0, 0, 0, 0))
        : new Date(Date.UTC(inputDate.year + 1, 0, 1, 0, 0, 0, 0)),
    };
    const payments = await this.prisma.payment.findMany({
      where: {
        subscription: { user_id: userId },
        payment_date: {
          gte: betweenDate.leftDate,
          lt: betweenDate.rightDate,
        },
      },
      include: {
        subscription: {
          include: {
            categories: true,
          },
        },
      },
      orderBy: {
        payment_date: 'desc',
      },
    });
    let amount: number = 0;
    const paymentByCategories = payments?.reduce(
      (acc, p) => {
        amount += Number(p.amount);
        p.subscription.categories.forEach((c) => {
          if (!acc[c.category]) {
            acc[c.category] = { amount: 0 };
          }
          acc[c.category].amount += Number(p.amount);
        });
        return acc;
      },
      {} as Record<string, { amount: number }>,
    );

    return amount
      ? {
          amount,
          payments,
          paymentByCategories,
        }
      : {};
  }

  async calculationNextAmount(userId: string) {
    const currentDate = new Date();
    const endDateYear = await this.getEndDate(
      currentDate,
      CalculationPeriod.YEAR,
    );
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        user_id: userId,
        status: {
          notIn: [StatusSubscription.DELETED, StatusSubscription.SUSPENDED],
        },
        period: { not: Period.LIFE },
        next_payment_at: { gt: currentDate, lt: endDateYear },
      },
      select: {
        next_amount: true,
        period: true,
        count: true,
        next_payment_at: true,
      },
    });

    const result = { month: 0, quarter: 0, halfYear: 0, year: 0 };
    if (!subscriptions.length) {
      return result;
    }

    const endDateHalfYear = await this.getEndDate(
      currentDate,
      CalculationPeriod.HALF_YEAR,
    );
    const endDateQuarter = await this.getEndDate(
      currentDate,
      CalculationPeriod.QUARTER,
    );
    const endDateMonth = await this.getEndDate(
      currentDate,
      CalculationPeriod.MONTH,
    );

    for (const s of subscriptions) {
      const amount = Number(s.next_amount);
      let nextDate = new Date(s.next_payment_at);
      while (nextDate < endDateYear && nextDate > currentDate) {
        result.year += amount;
        if (nextDate < endDateHalfYear) result.halfYear += amount;
        if (nextDate < endDateQuarter) result.quarter += amount;
        if (nextDate < endDateMonth) result.month += amount;

        nextDate = await this.paymentService.updateNextPaymentAt(
          nextDate,
          s.count,
          s.period,
        );
      }
    }

    return result;
  }

  async getEndDate(currentDate: Date, period: CalculationPeriod) {
    const copyDate = new Date(currentDate);
    return new Date(copyDate.setUTCMonth(copyDate.getUTCMonth() + period));
  }
}

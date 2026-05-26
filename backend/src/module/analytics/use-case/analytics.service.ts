import { Injectable } from '@nestjs/common';
import { getLeftDate } from 'src/common/const/date-transform';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { QueryDto } from '../presentation/dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(query: QueryDto, userId: string) {
    const inputDate = {
      year: Number(query.date.split('-')[0]),
      month: Number(query.date.split('-')[1]),
    };
    const betweenDate = {
      leftDate: new Date(
        Date.UTC(inputDate.year, inputDate.month - 1, 1, 0, 0, 0, 0),
      ),
      rightDate: new Date(
        Date.UTC(inputDate.year, inputDate.month, 1, 0, 0, 0, 0),
      ),
    };
    const [amount, payment] = await Promise.all([
      this.prisma.payment.aggregate({
        where: {
          subscription: { user_id: userId },
          payment_date: {
            gte: betweenDate.leftDate,
            lt: betweenDate.rightDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.payment.findMany({
        where: {
          subscription: { user_id: userId },
          payment_date: {
            gte: betweenDate.leftDate,
            lt: betweenDate.rightDate,
          },
        },
        select: {
          subscription: true,
          amount: true,
          payment_date: true,
        },
        orderBy: {
          payment_date: 'desc',
        },
      }),
    ]);
    return amount
      ? {
          amount,
          payment,
        }
      : {};
  }
}

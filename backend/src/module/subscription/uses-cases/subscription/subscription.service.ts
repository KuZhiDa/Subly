import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISubscriptionService } from './subscription.service.interface';
import {
  CreateSubscriptionDto,
  QueryDto,
  UpdateSubscriptionDto,
} from '../../presentation/dto/subscription.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Login } from 'src/infrastructure/database/generated/prisma/client';
import { PaymentService } from '../payment/payment.service';
import { CategoriesService } from '../categories/categories.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StructureInTable } from 'src/common/const/get-structure';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    private emitter: EventEmitter2,
  ) {}

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

    const nextPaymentAt = await this.paymentService.updateNextPaymentAt(
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
        next_payment_at: nextPaymentAt,
        next_amount: dto.amountNext ?? dto.amountLast,
      },
    });

    const payment = await this.paymentService.createPayment(
      subscription.id,
      dto.amountLast,
      dto.last_payment_at,
    );

    await this.categoriesService.addCategories(subscription.id, dto.categories);

    return { subscription, payment };
  }

  async update(
    userId: string,
    subscriptionId: string,
    dto: UpdateSubscriptionDto,
  ) {
    const subscription = await this.getOne(userId, subscriptionId);

    if (subscription.deleted_at) {
      throw new ForbiddenException('Эта подписка удалена.');
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
      data.next_payment_at = await this.paymentService.updateNextPaymentAt(
        subscription.last_payment_at,
        dto.count ?? subscription.count,
        dto.period ?? subscription.period,
      );
    }

    if (dto.amountNext) {
      data.next_amount = dto.amountNext;
    }

    if (dto.amountLast) {
      await this.paymentService.updateAmount(
        subscriptionId,
        dto.last_payment_at ?? subscription.last_payment_at,
        dto.amountLast,
      );
    }

    const categoriesCurrent = await this.prisma.subscriptionCategory.findMany({
      where: {
        subscription_id: subscriptionId,
      },
    });

    const current = categoriesCurrent.map((c) => c.category);

    const [categoriesDelete, categoriesAdd] = await Promise.all([
      current.filter((c) => !dto.categories.includes(c)),
      dto.categories.filter((c) => !current.includes(c)),
    ]);

    if (categoriesDelete?.length) {
      await this.categoriesService.deleteCategories(
        userId,
        subscriptionId,
        categoriesDelete,
      );
    }
    if (categoriesAdd?.length) {
      await this.categoriesService.addCategories(subscriptionId, categoriesAdd);
    }

    const {
      type_login,
      email,
      number,
      set_symbol,
      amountNext,
      amountLast,
      categories,
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

  async getAll(userId: string, query: QueryDto) {
    let where: any = { AND: [] };

    if (query.filters?.length) {
      const roads = await Promise.all(
        query.filters.map((q) => {
          const param = q.constant?.length
            ? { [q.filterColumn]: { in: q.constant } }
            : q.value?.length
              ? {
                  OR: q.value.map((v) => ({
                    [q.filterColumn]: { contains: v, mode: 'insensitive' },
                  })),
                }
              : null;

          if (param === null) {
            throw new BadRequestException('Пустой запрос.');
          }

          return this.createRoad(q.filterColumn, param);
        }),
      );
      where.AND.push(...roads);
    }

    const subscriptions = await this.prisma.subscription.findMany({
      where: { ...where, user_id: userId, deleted_at: null },
      include: { account: true, categories: true },
      orderBy: query.sorts?.map((s) => ({ [s.sortsColumn]: s.by })),
    });

    return subscriptions?.map((s) => ({
      id: s.id,
      name: s.name,
      last_payment_at: s.last_payment_at,
      next_payment_at: s.next_payment_at,
    }));
  }

  async createRoad(column: string, param: any) {
    const { connection, relations } = StructureInTable[column];

    const tables = connection.split('.');
    const type = relations.split('.');

    const road = tables.reduceRight(
      (acc, t, i) => {
        const isMany = type[i] === 'many';
        const isLast = i === tables.length - 1;

        if (isMany) {
          return { [t]: { some: { ...acc } } };
        }
        if (isLast) {
          return { ...acc };
        }
        return { [t]: { ...acc } };
      },
      { ...param },
    );
    return road;
  }

  async getOne(userId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { account: true, categories: true },
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
}

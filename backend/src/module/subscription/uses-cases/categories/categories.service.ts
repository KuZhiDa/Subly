import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ICategoriesService } from './categories.service.interface';
import { Category } from 'src/infrastructure/database/generated/prisma/enums';
import { SubscriptionService } from '../subscription/subscription.service';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class CategoriesService implements ICategoriesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SubscriptionService))
    private subscriptionService: SubscriptionService,
  ) {}

  async addCategories(subscriptionId: string, categories: Category[]) {
    return this.prisma.subscriptionCategory.createMany({
      data: categories.map((c) => ({
        category: c,
        subscription_id: subscriptionId,
      })),
      skipDuplicates: true,
    });
  }

  async addCategoryOne(
    userId: string,
    subscriptionId: string,
    categories: Category[],
  ) {
    const subscription = await this.subscriptionService.getOne(
      userId,
      subscriptionId,
    );

    if (subscription.deleted_at) {
      throw new ForbiddenException('Данная нагрузка удалена.');
    }

    return this.addCategories(subscriptionId, categories);
  }

  async deleteCategories(
    userId: string,
    subscriptionId: string,
    categories: Category[],
  ) {
    const subscription = await this.subscriptionService.getOne(
      userId,
      subscriptionId,
    );

    if (subscription.deleted_at) {
      throw new ForbiddenException('Данная нагрузка удалена.');
    }

    return this.prisma.subscriptionCategory.deleteMany({
      where: {
        subscription_id: subscriptionId,
        category: { in: categories },
      },
    });
  }

  async getCategoriesAll() {
    return Object.values(Category);
  }
}

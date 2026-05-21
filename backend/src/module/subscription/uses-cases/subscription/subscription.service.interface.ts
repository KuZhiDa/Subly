import { Category } from 'src/infrastructure/database/generated/prisma/enums';
import {
  CreatePaidDto,
  CreateSubscriptionDto,
  QueryDto,
  UpdateSubscriptionDto,
} from '../../presentation/dto/subscription.dto';

export interface ISubscriptionService {
  create(dto: CreateSubscriptionDto, userId: string);
  getAll(userId: string, query: QueryDto);
  getOne(userId: string, subscriptionId: string);
  update(userId: string, subscriptionId: string, dto: UpdateSubscriptionDto);
  delete(userId: string, subscriptionId: string);
}

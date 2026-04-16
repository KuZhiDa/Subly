import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../presentation/dto/subscription.dto';

export interface ISubscriptionService {
  create(dto: CreateSubscriptionDto, userId: string);
  getAll(userId: string);
  getOne(userId: string, subscriptionId: string);
  update(userId: string, subscriptionId: string, dto: UpdateSubscriptionDto);
  delete(userId: string, subscriptionId: string);
}

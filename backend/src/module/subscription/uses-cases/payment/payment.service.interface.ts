import { Period } from 'src/database/generated/prisma/enums';
import { CreatePaidDto } from '../../presentation/dto/subscription.dto';

export interface IPaymentService {
  createPayment(subscriptionId: string, amount: number, paymentDate: Date);
  updateNextPaymentAt(lastPaymentAt: Date, count: number, period: Period);
  updateAmount(subscriptionId: string, lastPaymentAt: Date, amount: number);
  paidSubscription(userId: string, subscriptionId: string, dto: CreatePaidDto);
}

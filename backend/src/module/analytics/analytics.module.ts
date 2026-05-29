import { Module } from '@nestjs/common';
import { AnalyticsService } from './use-case/analytics.service';
import { AnalyticsController } from './presentation/analytics.controller';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [SubscriptionModule],
})
export class AnalyticsModule {}

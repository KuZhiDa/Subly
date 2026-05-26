import { Module } from '@nestjs/common';
import { AnalyticsService } from './use-case/analytics.service';
import { AnalyticsController } from './presentation/analytics.controller';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MonitorModule } from '../monitor/monitor.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [BullModule.registerQueue({ name: 'notifications' })],
  exports: [NotificationService],
})
export class NotificationModule {}

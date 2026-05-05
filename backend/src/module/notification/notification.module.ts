import { Module } from '@nestjs/common';
import { QueueModule } from '../../infrastructure/queue/queue.module';
import { NotificationController } from './presentation/notification.controller';
import { NotificationService } from './use-case/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [QueueModule],
  exports: [NotificationService],
})
export class NotificationModule {}

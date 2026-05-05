import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  providers: [MonitorService],
  imports: [QueueModule],
  exports: [MonitorService],
})
export class MonitorModule {}

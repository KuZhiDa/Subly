import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { QueueModule } from '../queue/queue.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [MonitorService],
  imports: [QueueModule, ScheduleModule.forRoot()],
  exports: [MonitorService],
})
export class MonitorModule {}

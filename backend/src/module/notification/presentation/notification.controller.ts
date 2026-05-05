import { Controller, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../use-case/notification.service';

@ApiTags('Уведомления пользователя.')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private emitter: EventEmitter2,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Sse('stream')
  @ApiOperation({ summary: 'Получение уведомлений в real-time.' })
  getEmits(@CurrentUser('id') userId: string) {
    return fromEvent(this.emitter, 'ExpiredSubscription').pipe(
      map((data: any) => ({ data })),
    );
  }
}

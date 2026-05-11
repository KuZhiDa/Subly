import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { fromEvent, map, merge } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../use-case/notification.service';
import { getMessageForNotification } from 'src/common/const/message';
import { INotificationService } from '../use-case/notifications.service.interface';

@ApiTags('Уведомления пользователя')
@Controller('notification')
export class NotificationController implements INotificationService {
  constructor(
    private readonly notificationService: NotificationService,
    private emitter: EventEmitter2,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Sse('stream')
  @ApiOperation({ summary: 'Получение уведомлений в real-time.' })
  getEmits(@CurrentUser('id') userId: string) {
    const expired = fromEvent(this.emitter, 'ExpiredSubscriptions');
    const deadline = fromEvent(this.emitter, 'DeadlineSubscriptions');
    return merge(expired, deadline).pipe(
      map((data: any) => ({
        data: data
          .filter((d) => d.user.id === userId)
          .flatMap((d) =>
            d.subscription.map((s) => {
              return { message: getMessageForNotification(s.type, s.name) };
            }),
          ),
      })),
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Получение всех уведомлений пользователя.' })
  async getNotifications(@CurrentUser('id') userId: string) {
    return await this.notificationService.get(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @ApiOperation({ summary: 'Отметка уведомления как прочитанное.' })
  @ApiBody({ description: 'Список id уведомлений.', type: [String] })
  async readNotifications(
    @CurrentUser('id') userId: string,
    @Body() notifications: string[],
  ) {
    return await this.notificationService.updateStatus(userId, notifications);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @ApiOperation({ summary: 'Удаление уведомлений.' })
  @ApiBody({ description: 'Список id уведомлений.', type: [String] })
  async deleteNotifications(
    @CurrentUser('id') userId: string,
    @Body() notifications: string[],
  ) {
    return await this.notificationService.delete(userId, notifications);
  }
}

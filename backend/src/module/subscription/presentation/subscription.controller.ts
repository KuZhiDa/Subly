import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from '../use-case/subscription.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { CurrentUser } from 'src/common/decorator/user.decorator';

@ApiTags('Управление подписками')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Создание подписки.',
  })
  @ApiBody({
    description: 'Данные подписки.',
    type: CreateSubscriptionDto,
  })
  async createSubscription(
    @Body() dto: CreateSubscriptionDto,
    @CurrentUser('id') id: string,
  ) {
    return await this.subscriptionService.create(dto, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({
    summary: 'Получение всех подписок пользователя.',
  })
  async getAll(@CurrentUser('id') id: string) {
    return await this.subscriptionService.getAll(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({
    summary: 'Получение всех подписок пользователя.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Id подписки.',
  })
  async getOne(
    @CurrentUser('id') userId: string,
    @Param('id') subscriptionId: string,
  ) {
    return await this.subscriptionService.getOne(userId, subscriptionId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({
    summary: 'Обновление подписки.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Id обновляемой подписки.',
  })
  @ApiBody({
    description: 'Данные для обновления',
    type: UpdateSubscriptionDto,
  })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') subscriptionId: string,
    @Body() UpdateSubscriptionDto,
  ) {
    return await this.subscriptionService.update(
      userId,
      subscriptionId,
      UpdateSubscriptionDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление подписки.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Id удаляемой подписки.',
  })
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id') subscriptionId: string,
  ) {
    return await this.subscriptionService.delete(userId, subscriptionId);
  }
}

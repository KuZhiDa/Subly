import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from '../uses-cases/subscription/subscription.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CategoriesDto,
  CreatePaidDto,
  CreateSubscriptionDto,
  QueryDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { CategoriesService } from '../uses-cases/categories/categories.service';
import { PaymentService } from '../uses-cases/payment/payment.service';

@ApiTags('Управление подписками')
@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly categoriesService: CategoriesService,
    private readonly paymentService: PaymentService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({
    summary: 'Получение всех подписок пользователя.',
  })
  async getAll(@CurrentUser('id') id: string, @Query() query: QueryDto) {
    return await this.subscriptionService.getAll(id, query);
  }

  @Get('categories-all')
  @ApiOperation({ summary: 'Получение списка категорий.' })
  async getCategoriesAll() {
    return await this.categoriesService.getCategoriesAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({
    summary: 'Получение конкретной подписки пользователя.',
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
  @Post(':id/categories')
  @ApiOperation({ summary: 'Добавление категории у подписки.' })
  @ApiParam({ name: 'id', type: String, description: 'id подписки.' })
  @ApiBody({
    description: 'Список категорий (всегда будет один элемент)',
    type: CategoriesDto,
  })
  async addCategories(
    @CurrentUser('id') userId: string,
    @Param('id') subscriptionId: string,
    @Body() dto: CategoriesDto,
  ) {
    return await this.categoriesService.addCategoryOne(
      userId,
      subscriptionId,
      dto.categories,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/payment')
  @ApiOperation({ summary: 'Создание записи о платеже подписки.' })
  @ApiBody({ description: 'Данные оплаты', type: CreatePaidDto })
  async createPaid(
    @CurrentUser('id') userId: string,
    @Param('id') subscriptionId: string,
    @Body() dto: CreatePaidDto,
  ) {
    await this.paymentService.paidSubscription(userId, subscriptionId, dto);
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
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return await this.subscriptionService.update(userId, subscriptionId, dto);
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/categories')
  @ApiOperation({ summary: 'Удаление категории у подписки.' })
  @ApiParam({ name: 'id', type: String, description: 'id подписки.' })
  @ApiBody({
    description: 'Список категорий (всегда будет один элемент)',
    type: CategoriesDto,
  })
  async deleteCategories(
    @CurrentUser('id') userId: string,
    @Param('id') subscriptionId: string,
    @Body() dto: CategoriesDto,
  ) {
    return await this.categoriesService.deleteCategories(
      userId,
      subscriptionId,
      dto.categories,
    );
  }
}

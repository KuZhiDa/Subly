import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../use-case/analytics.service';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QueryDto } from './dto/analytics.dto';

@ApiTags('Аналитика расходов.')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @ApiOperation({ summary: 'Получение истории за определенный месяц.' })
  async history(@CurrentUser('id') userId: string, @Query() query: QueryDto) {
    return await this.analyticsService.getHistory(query, userId);
  }
}

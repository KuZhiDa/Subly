import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../use-case/analytics.service';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HistoryDto } from './dto/analytics.dto';

@ApiTags('Аналитика расходов.')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('history')
  @ApiOperation({ summary: 'Получение истории за определенный месяц.' })
  async history(@CurrentUser('id') userId: string, @Query() query: HistoryDto) {
    return await this.analyticsService.getHistory(query, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('calculation')
  @ApiOperation({ summary: 'Получение будущих расходов.' })
  async calculation(@CurrentUser('id') userId: string) {
    return await this.analyticsService.calculationNextAmount(userId);
  }
}

import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../use-case/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateDto } from './dto/update.dto';
import { CurrentUser } from 'src/common/decorator/user.decorator';

@ApiTags('Управление пользователем.')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({
    summary: 'Получение данных пользователя.',
  })
  async getOne(@CurrentUser('id') id: string) {
    return await this.userService.getOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({
    summary: 'обновление данных пользователя.',
  })
  async update(@CurrentUser('id') id: string, @Body() dto: UpdateDto) {
    return await this.userService.update(id, dto);
  }
}

import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../use-case/user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateDto } from './dto/user.dto';
import { CurrentUser } from 'src/common/decorator/user.decorator';

@ApiTags('Управление пользователем')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @ApiOperation({
    summary: 'Получение данных пользователя.',
  })
  async getOne(@CurrentUser('id') id: string) {
    return await this.userService.getOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('')
  @ApiOperation({
    summary: 'обновление данных пользователя.',
  })
  async update(@CurrentUser('id') id: string, @Body() dto: UpdateDto) {
    return await this.userService.update(id, dto);
  }
}

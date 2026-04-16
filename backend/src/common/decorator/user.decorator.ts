import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user?.[data] ? request.user?.[data] : request.user;
    if (!user) {
      throw new NotFoundException('Нет данных о юзере.');
    }
    return user;
  },
);

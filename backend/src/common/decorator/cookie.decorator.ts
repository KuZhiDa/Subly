import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const result = data ? request.cookies?.[data] : request.cookies;
    if (!result) {
      throw new NotFoundException('Нет данных в куках');
    }
    return result;
  },
);

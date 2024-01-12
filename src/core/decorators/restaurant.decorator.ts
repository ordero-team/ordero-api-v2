import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';
import { has } from 'lodash';

export const Rest = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!has(request, 'current.restaurant')) {
    throw new NotFoundException('Restaurant is not found');
  }

  return request.current.restaurant;
});

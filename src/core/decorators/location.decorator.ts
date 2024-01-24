import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Loc = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.current.location || null;
});

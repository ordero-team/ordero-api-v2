import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { get, isEmpty } from 'lodash';

export const Quero = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const query = JSON.parse(JSON.stringify(request.query));
  if (!isEmpty(data)) {
    return get(query, data, undefined);
  }

  return query;
});

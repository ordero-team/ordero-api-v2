import { UnauthorizedException } from '@nestjs/common';

export class TokenException extends UnauthorizedException {
  constructor(message, error = 'Invalid Token') {
    super({ statusCode: 401, code: 'invalid_token', message }, error);
  }
}

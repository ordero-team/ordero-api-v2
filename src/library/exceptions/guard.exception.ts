import { UnauthorizedException } from '@nestjs/common';

export class GuardException extends UnauthorizedException {
  constructor(message, error = 'Forbidden') {
    super({ statusCode: 401, code: 'forbidden_resource', message }, error);
  }
}

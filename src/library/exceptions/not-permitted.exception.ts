import { ForbiddenException } from '@nestjs/common';

export class NotPermittedException extends ForbiddenException {
  constructor() {
    super('You are not allowed to do this action');
  }
}

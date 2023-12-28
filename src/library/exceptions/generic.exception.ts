import { BadRequestException } from '@nestjs/common';

export class GenericException extends BadRequestException {
  constructor(message, error = 'Bad Request') {
    super(message, error);
  }
}

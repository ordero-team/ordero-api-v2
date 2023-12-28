import { HttpException, HttpStatus } from '@nestjs/common';
import { Validator } from 'validatorjs';

export class ValidationException extends HttpException {
  constructor(validation: Validator<any>) {
    const results = [];
    const messages: any = validation.errors.all() || {};
    for (const [field, errors] of Object.entries(messages) as any) {
      for (const error of errors) {
        results.push({ field, error });
      }
    }

    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Unprocessable Entity',
        errors: results,
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

export class ValidationSingleException extends HttpException {
  constructor(validation: Validator<any>) {
    const results = [];
    const messages: any = validation.errors.all() || {};
    for (const errors of Object.values(messages) as any) {
      for (const error of errors) {
        results.push(error);
      }
    }

    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: results.toString(),
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

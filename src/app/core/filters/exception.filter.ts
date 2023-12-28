import { GuardException } from '@lib/exceptions/guard.exception';
import { TokenException } from '@lib/exceptions/token.exception';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { config } from '@lib/helpers/config.helper';
import { keysToSnake } from '@lib/helpers/utils.helper';
import Log from '@lib/logger/logger.library';
import { ArgumentsHost, Catch, ExceptionFilter as Filter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { get, has, isNil, isObject, omitBy } from 'lodash';
import { stringify } from 'flatted';

@Catch()
export class ExceptionFilter implements Filter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // parse status
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    // parse error message
    let message = get(exception, 'message.error', 'Something bad happened!');
    if (exception instanceof Error) {
      message = get(exception, 'message', 'Something bad happened!');
    }

    // parse validation errors
    let errors = {};
    const except = [ValidationException, TokenException, GuardException];
    if (except.some((row) => exception instanceof row)) {
      errors = exception.getResponse();
    }

    const payload: any = keysToSnake({
      success: false,
      requestId: request.id,
      ...(isObject(message) ? message : { message }),
      ...errors,
    });

    // if not a validation error
    if (!(exception instanceof ValidationException)) {
      Log.getInstance().notify(exception);
      console.error(exception);
    }

    if (config.isDebugging()) {
      const logger = new Logger('Exception');
      if (config.isDevelopment()) {
        logger.error(exception);
      } else {
        // delete circular object
        if (has(exception, 'rawHttpClientData.request')) {
          delete exception.rawHttpClientData.request;
        }

        logger.error(stringify(exception));
      }
    }

    // return to frontend
    response.status(status).send(
      omitBy(
        {
          success: payload.success,
          request_id: payload.request_id,
          code: payload.code,
          message: payload.message,
          errors: payload.errors,
        },
        isNil
      )
    );
  }
}

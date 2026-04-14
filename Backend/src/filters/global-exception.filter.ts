import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // HttpExceptions (401, 403, 404, 429…) carry their own status and message.
    // Pass them through directly instead of masking them as 500.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      return response.status(status).json(
        typeof body === 'object' ? body : { statusCode: status, message: body },
      );
    }

    // Truly unexpected errors: log details in dev, generic message in prod.
    if (process.env.NODE_ENV !== 'production') {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.error('Unhandled exception', String(exception));
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
      error: 'An unexpected error occurred',
    });
  }
}

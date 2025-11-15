/**
 * HTTP Exception Filter - Best Practice
 *
 * Catches all exceptions and formats them consistently
 * Provides proper error responses
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    interface ErrorMessage {
      message?: string;
      error?: string | string[];
    }

    const errorResponse: {
      success: boolean;
      statusCode: number;
      timestamp: string;
      path: string;
      method: string;
      message: string;
      error?: string | string[];
    } = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as ErrorMessage).message || 'An error occurred',
    };

    if (typeof message === 'object' && (message as ErrorMessage).error) {
      errorResponse.error = (message as ErrorMessage).error;
    }

    // Log error
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status} - ${errorResponse.message}`);
    }

    response.status(status).json(errorResponse);
  }
}

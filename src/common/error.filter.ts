import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      response.status(status).json({
        success: false,
        code: status,
        data: exception.message,
      });
      return;
    }

    if (exception instanceof ZodError) {
      response.status(400).json({
        success: false,
        code: 400,
        data: exception.message,
      });
      return;
    }

    response.status(500).json({
      success: false,
      code: 500,
      data: 'Internal server error',
    });
  }
}

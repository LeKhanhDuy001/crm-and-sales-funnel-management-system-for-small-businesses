import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorDetail {
  field?: string;
  issue: string;
}

interface ExceptionPayload {
  code?: string;
  message?: string | string[];
  details?: ErrorDetail[];
}

interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details: ErrorDetail[];
  };
}

const ERROR_CODES: Partial<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
  [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};

const ERROR_MESSAGES: Partial<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'Dữ liệu gửi lên không hợp lệ',
  [HttpStatus.UNAUTHORIZED]:
    'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn',
  [HttpStatus.FORBIDDEN]: 'Bạn không có quyền thực hiện chức năng này',
  [HttpStatus.NOT_FOUND]: 'Không tìm thấy tài nguyên yêu cầu',
  [HttpStatus.CONFLICT]: 'Dữ liệu đang xung đột với trạng thái hiện tại',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Dữ liệu vi phạm quy tắc nghiệp vụ',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Bạn đã gửi quá nhiều yêu cầu',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Đã xảy ra lỗi hệ thống',
};

const GENERIC_MESSAGES = new Set([
  'Bad Request',
  'Unauthorized',
  'Forbidden',
  'Not Found',
  'Conflict',
  'Unprocessable Entity',
  'Too Many Requests',
  'Internal Server Error',
]);

// Nguồn hỗ trợ: ChatGPT (OpenAI).
// Nhóm đã kiểm tra, điều chỉnh và mô tả việc sử dụng AI tại Chương 4.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Chuyển mọi exception thành HTTP response thống nhất.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const statusCode = this.getStatusCode(exception);

    const payload = this.getPayload(exception);

    const messages = this.getMessages(payload, statusCode);

    const message = messages[0] ?? this.getDefaultMessage(statusCode);

    const details =
      payload.details ?? messages.slice(1).map((issue) => ({ issue }));

    const responseBody: ErrorEnvelope = {
      error: {
        code: payload.code ?? this.getDefaultCode(statusCode),
        message,
        details,
      },
    };

    this.logException(exception, request, statusCode);

    response.status(statusCode).json(responseBody);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getPayload(exception: unknown): ExceptionPayload {
    if (!(exception instanceof HttpException)) {
      return {};
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        message: response,
      };
    }

    return response;
  }

  private getMessages(payload: ExceptionPayload, statusCode: number): string[] {
    const fallback = this.getDefaultMessage(statusCode);

    if (Array.isArray(payload.message)) {
      return [fallback, ...payload.message];
    }

    if (!payload.message || GENERIC_MESSAGES.has(payload.message)) {
      return [fallback];
    }

    return [payload.message];
  }

  private getDefaultCode(statusCode: number): string {
    return ERROR_CODES[statusCode] ?? `HTTP_${statusCode}`;
  }

  private getDefaultMessage(statusCode: number): string {
    return ERROR_MESSAGES[statusCode] ?? 'Yêu cầu không thể được xử lý';
  }

  private logException(
    exception: unknown,
    request: Request,
    statusCode: number,
  ): void {
    const context =
      `${request.method} ` + `${request.originalUrl} - ${statusCode}`;

    if (statusCode >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;

      this.logger.error(context, stack);
      return;
    }

    this.logger.warn(context);
  }
}

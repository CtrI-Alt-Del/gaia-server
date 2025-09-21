import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'

import {
  AppError,
  ConflictError,
  NotAllowedError,
  NotFoundError,
  NullException,
  ValidationException,
} from '@/core/global/domain/errors'
import { ZodValidationException } from 'nestjs-zod'
import { UnauthorizedError } from '@/core/auth'

@Catch()
export class RestExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse()

    if (exception instanceof ZodValidationException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        title: 'Validation failed',
        ...JSON.parse(exception.getZodError() as string),
      })
    }

    if (exception instanceof AppError) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR

      if (exception instanceof UnauthorizedError) {
        status = HttpStatus.UNAUTHORIZED
      }

      if (exception instanceof ValidationException) {
        status = HttpStatus.BAD_REQUEST
      }

      if (exception instanceof NullException) {
        status = HttpStatus.BAD_REQUEST
      }

      if (exception instanceof ConflictError) {
        status = HttpStatus.CONFLICT
      }

      if (exception instanceof NotAllowedError) {
        status = HttpStatus.FORBIDDEN
      }

      if (exception instanceof NotFoundError) {
        status = HttpStatus.NOT_FOUND
      }

      return response.status(status).json({
        title: exception.title,
        message: exception.message,
      })
    }

    console.error('Internal Exception: ', exception)

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      title: 'Unknown Error',
      message: 'Erro interno desconhecido',
    })
  }
}

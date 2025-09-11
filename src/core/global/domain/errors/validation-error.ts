import { AppError } from '@/core/global/domain/errors/app-error'

export class ValidationException extends AppError {
  constructor(key: string, message: string) {
    super(`${key} ${message}`)
  }
}

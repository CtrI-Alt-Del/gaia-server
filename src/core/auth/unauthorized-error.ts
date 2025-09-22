import { AppError } from '../global/domain/errors'

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 'Unauthorized Error')
  }
}

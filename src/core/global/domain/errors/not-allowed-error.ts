import { AppError } from './app-error'

export class NotAllowedError extends AppError {
  constructor(message: string) {
    super(message, 'Not Allowed Error')
  }
}

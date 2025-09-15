import { AppError } from '@/core/global/domain/errors/app-error'

export class NullException extends AppError {
  constructor(entityName: string) {
    super(`Entidade ${entityName} é nula`)
  }
}

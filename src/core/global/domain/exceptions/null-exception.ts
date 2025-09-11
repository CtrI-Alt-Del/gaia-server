import { AppException } from '@/core/global/domain/exceptions/app-exception'

export class NullException extends AppException {
  constructor(entityName: string) {
    super(`Entidade ${entityName} é nula`)
  }
}

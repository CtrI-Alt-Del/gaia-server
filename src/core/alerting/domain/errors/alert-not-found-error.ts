import { NotFoundError } from '@/core/global/domain/errors'

export class AlertNotFoundError extends NotFoundError {
  constructor() {
    super('Alerta não encontrado')
  }
}

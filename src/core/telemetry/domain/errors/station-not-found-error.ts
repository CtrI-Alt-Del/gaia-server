import { NotFoundError } from '@/core/global/domain/errors'

export class StationNotFoundError extends NotFoundError {
  constructor() {
    super('Estacao nao encontrada')
  }
}

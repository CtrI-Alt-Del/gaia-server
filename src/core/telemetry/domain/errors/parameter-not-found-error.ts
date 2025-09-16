import { NotFoundError } from '@/core/global/domain/errors'

export class ParameterNotFoundError extends NotFoundError {
  constructor() {
    super('Parâmetro não encontrado')
  }
}

import { NotFoundError } from '@/core/global/domain/errors'

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('Usuário não encontrado')
  }
}

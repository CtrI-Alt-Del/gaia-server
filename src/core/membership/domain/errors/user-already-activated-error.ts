import { ConflictError } from '@/core/global/domain/errors/conflict-error'

export class UserAlreadyActivatedError extends ConflictError {
  constructor() {
    super('Usuário já ativado')
  }
}

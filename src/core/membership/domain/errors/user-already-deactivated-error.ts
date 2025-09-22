import { ConflictError } from '@/core/global/domain/errors'

export class UserAlreadyDeactivatedError extends ConflictError {
  constructor() {
    super('Usuário já desativado')
  }
}

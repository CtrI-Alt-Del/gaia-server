import { NotAllowedError } from '@/core/global/domain/errors/not-allowed-error'

export class OwnerCreationNotAllowed extends NotAllowedError {
  constructor() {
    super('Este tipo de usuário não pode ser criado')
  }
}

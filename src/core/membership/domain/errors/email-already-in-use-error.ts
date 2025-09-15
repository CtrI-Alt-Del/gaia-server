import { ConflictError } from '@/core/global/domain/errors/conflict-error'

export class EmailAlreadyInUseError extends ConflictError {
  constructor() {
    super('Email já está em uso')
  }
}

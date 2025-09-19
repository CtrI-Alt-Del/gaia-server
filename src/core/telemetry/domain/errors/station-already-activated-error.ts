import { ConflictError } from "@/core/global/domain/errors"

export class StationAlreadyActivatedError extends ConflictError {
  constructor() {
    super('Estação já está ativada')
    this.name = 'StationAlreadyActivatedError'
  }
}

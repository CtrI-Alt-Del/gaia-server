import { ConflictError } from "@/core/global/domain/errors"

export class StationAlreadyDeactivatedError extends ConflictError {
  constructor() {
    super('Estacao ja desativada')
    this.name = 'ParameterAlreadyDeactivatedError'
  }
}

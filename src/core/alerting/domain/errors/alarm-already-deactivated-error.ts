import { AppError } from "@/core/global/domain/errors"

export class AlarmAlreadyDeactivatedError extends AppError {
  constructor() {
    super('Alarm is already deactivated')
    this.name = 'AlarmAlreadyDeactivatedError'
  }
}

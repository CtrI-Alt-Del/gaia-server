export class AlarmAlreadyDeactivatedError extends Error {
  constructor() {
    super('Alarm is already deactivated')
    this.name = 'AlarmAlreadyDeactivatedError'
  }
}

export class StationAlreadyDeactivatedError extends Error {
  constructor() {
    super('Estacao ja desativada')
    this.name = 'ParameterAlreadyDeactivatedError'
  }
}

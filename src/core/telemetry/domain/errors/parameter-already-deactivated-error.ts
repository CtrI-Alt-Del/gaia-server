export class ParameterAlreadyDeactivatedError extends Error {
  constructor() {
    super('Parameter is already deactivated')
    this.name = 'ParameterAlreadyDeactivatedError'
  }
}

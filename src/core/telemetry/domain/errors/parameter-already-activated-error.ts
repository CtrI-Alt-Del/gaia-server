export class ParameterAlreadyActivatedError extends Error {
  constructor() {
    super('Parameter is already activated')
    this.name = 'ParameterAlreadyActivatedError'
  }
}

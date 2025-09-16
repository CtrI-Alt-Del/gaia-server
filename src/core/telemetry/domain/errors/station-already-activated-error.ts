export class StationAlreadyActivatedError extends Error {
  constructor() {
    super('Estação já está ativada')
    this.name = 'StationAlreadyActivatedError'
  }
}

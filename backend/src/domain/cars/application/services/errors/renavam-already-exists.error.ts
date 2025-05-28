export class RenavamAlreadyExistsError extends Error {
  constructor(message: string = 'Renavam already exists') {
    super(message)
    this.name = 'RenavamAlreadyExistsError'
  }
}

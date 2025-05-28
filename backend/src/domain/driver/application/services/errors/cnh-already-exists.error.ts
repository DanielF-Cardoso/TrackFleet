export class CnhAlreadyExistsError extends Error {
  constructor(message: string = 'Cnh already exists') {
    super(message)
    this.name = 'CnhAlreadyExistsError'
  }
}

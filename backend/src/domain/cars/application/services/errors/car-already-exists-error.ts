export class CarAlreadyExistsError extends Error {
  constructor(message: string = 'Car already exists') {
    super(message)
    this.name = 'CarAlreadyExistsError'
  }
}

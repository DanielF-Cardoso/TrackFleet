export class DriverAlreadyExistsError extends Error {
  constructor(message: string = 'Driver already exists') {
    super(message)
    this.name = 'DriverAlreadyExistsError'
  }
}

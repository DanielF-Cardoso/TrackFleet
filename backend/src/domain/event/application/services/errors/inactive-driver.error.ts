export class InactiveDriverError extends Error {
  constructor(message: string = 'Driver is inactive') {
    super(message)
    this.name = 'InactiveDriverError'
  }
}

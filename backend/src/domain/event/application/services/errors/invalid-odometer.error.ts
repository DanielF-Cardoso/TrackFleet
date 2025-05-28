export class InvalidOdometerError extends Error {
  constructor(message: string = 'Invalid odometer') {
    super(message)
    this.name = 'InvalidOdometerError'
  }
}

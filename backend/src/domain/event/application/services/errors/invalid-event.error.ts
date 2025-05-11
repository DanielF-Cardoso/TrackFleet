export class InvalidEventError extends Error {
  constructor(message: string = 'Invalid event') {
    super(message)
    this.name = 'InvalidEventError'
  }
}

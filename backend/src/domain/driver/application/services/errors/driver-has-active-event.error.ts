export class DriverHasActiveEventError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DriverHasActiveEventError'
  }
}

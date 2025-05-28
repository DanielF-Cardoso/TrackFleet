export class DriverNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DriverNotFoundError'
  }
}

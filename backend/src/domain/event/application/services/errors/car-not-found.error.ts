export class CarNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CarNotFoundError'
  }
}

export class CarNotFoundError extends Error {
  constructor(message: string = 'Car not found') {
    super(message)
    this.name = 'CarNotFoundError'
  }
}

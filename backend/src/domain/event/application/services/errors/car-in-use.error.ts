export class CarInUseError extends Error {
  constructor(message: string = 'Car is in use') {
    super(message)
    this.name = 'CarInUseError'
  }
}

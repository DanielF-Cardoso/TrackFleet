export class OdometerToHighError extends Error {
  constructor(message: string = 'Odometer is too high') {
    super(message)
    this.name = 'OdometerToHighError'
  }
}

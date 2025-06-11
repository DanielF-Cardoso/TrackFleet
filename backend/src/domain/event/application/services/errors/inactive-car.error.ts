export class InactiveCarError extends Error {
  constructor(message: string = 'Car is inactive') {
    super(message)
    this.name = 'InactiveCarError'
  }
}

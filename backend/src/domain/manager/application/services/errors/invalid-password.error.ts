export class InvalidPasswordError extends Error {
  constructor(message: string = 'Invalid Password') {
    super(message)
    this.name = 'InvalidPasswordError'
  }
}

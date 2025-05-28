export class EmailAlreadyExistsError extends Error {
  constructor(message: string = 'Email already exists') {
    super(message)
    this.name = 'EmailAlreadyExistsError'
  }
}

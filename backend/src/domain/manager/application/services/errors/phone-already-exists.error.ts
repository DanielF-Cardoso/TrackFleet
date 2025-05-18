export class PhoneAlreadyExistsError extends Error {
  constructor(message: string = 'Phone already exists') {
    super(message)
    this.name = 'PhoneAlreadyExistsError'
  }
}

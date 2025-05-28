export class SamePhoneError extends Error {
  constructor(
    message: string = 'The new phone cannot be the same as the current phone',
  ) {
    super(message)
    this.name = 'SamePhoneError'
  }
}

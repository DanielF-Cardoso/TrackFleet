export class SameEmailError extends Error {
  constructor(
    message: string = 'The new email cannot be the same as the current email',
  ) {
    super(message)
    this.name = 'SameEmailError'
  }
}

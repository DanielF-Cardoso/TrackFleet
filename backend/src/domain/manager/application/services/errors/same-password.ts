export class SamePasswordError extends Error {
  constructor(
    message: string = 'The new password cannot be the same as the current password',
  ) {
    super(message)
    this.name = 'SamePasswordError'
  }
}

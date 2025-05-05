export class SameCnhError extends Error {
  constructor(
    message: string = 'The new cnh cannot be the same as the current cnh',
  ) {
    super(message)
    this.name = 'SameCnhError'
  }
}

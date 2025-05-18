export class LastManagerCannotBeInactivatedError extends Error {
  constructor(message: string = 'Cannot inactivate the last manager') {
    super(message)
    this.name = 'LastManagerCannotBeInactivatedError'
  }
}

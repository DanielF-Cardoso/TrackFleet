export class CannotDeleteLastManagerError extends Error {
  constructor(message: string = 'Cannot delete the last manager') {
    super(message)
    this.name = 'CannotDeleteLastManagerError'
  }
}

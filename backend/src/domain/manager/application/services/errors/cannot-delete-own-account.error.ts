export class CannotDeleteOwnAccountError extends Error {
  constructor(message: string = 'Cannot delete your own account') {
    super(message)
    this.name = 'CannotDeleteOwnAccountError'
  }
}

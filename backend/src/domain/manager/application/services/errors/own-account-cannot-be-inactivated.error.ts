export class OwnAccountCannotBeInactivatedError extends Error {
  constructor(message: string = 'Cannot inactivate your own account') {
    super(message)
    this.name = 'OwnAccountCannotBeInactivatedError'
  }
}

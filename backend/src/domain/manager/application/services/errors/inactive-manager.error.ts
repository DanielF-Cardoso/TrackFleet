export class InactiveManagerError extends Error {
  constructor(message: string = 'Inactive manager') {
    super(message)
    this.name = 'InactiveManagerError'
  }
}

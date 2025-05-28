export class CannotDeleteFinalizedEventError extends Error {
  constructor(message: string = 'Cannot delete finalized event') {
    super(message)
    this.name = 'CannotDeleteFinalizedEventError'
  }
}

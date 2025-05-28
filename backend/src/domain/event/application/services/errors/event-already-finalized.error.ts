export class EventAlreadyFinalizedError extends Error {
  constructor(message: string = 'Event already finalized') {
    super(message)
    this.name = 'EventAlreadyFinalizedError'
  }
}

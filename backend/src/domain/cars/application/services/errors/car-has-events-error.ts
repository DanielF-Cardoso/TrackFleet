export class CarHasEventsError extends Error {
  constructor(
    message: string = 'Car has associated events and cannot be deleted.',
  ) {
    super(message)
    this.name = 'carHasEventsError'
  }
}

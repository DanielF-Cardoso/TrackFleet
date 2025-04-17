export class SameEmailError extends Error {
  constructor() {
    super('New email must be different from the current email.')
  }
}

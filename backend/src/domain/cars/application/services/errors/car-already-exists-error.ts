export class CarAlreadyExistsError extends Error {
  constructor() {
    super('Car already exists')
  }
}

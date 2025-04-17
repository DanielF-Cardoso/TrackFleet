export class ManagerAlreadyExistsError extends Error {
  constructor() {
    super('Manager already exists')
  }
}

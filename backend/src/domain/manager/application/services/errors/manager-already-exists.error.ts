export class ManagerAlreadyExistsError extends Error {
  constructor(message: string = 'Manager already exists') {
    super(message)
    this.name = 'ManagerAlreadyExistsError'
  }
}

export class ManagerNotFound extends Error {
  constructor() {
    super(`Manager not found.`)
  }
}

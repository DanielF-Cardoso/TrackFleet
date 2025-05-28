export class LicensePlateAlreadyExistsError extends Error {
  constructor(message: string = 'License plate already exists') {
    super(message)
    this.name = 'LicensePlateAlreadyExistsError'
  }
}

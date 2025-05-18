export class TokenRequestTooSoonError extends Error {
  constructor(message: string) {
    super(message)
  }
}

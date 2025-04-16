export class Email {
  private readonly value: string

  constructor(email: string) {
    if (!this.validate(email)) {
      throw new Error('Invalid email format.')
    }

    this.value = email.toLowerCase()
  }

  private validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  getValue(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.getValue()
  }

  toValue(): string {
    return this.value
  }
}

export class Renavam {
  private readonly value: string
  constructor(value: string) {
    if (!Renavam.validate(value)) {
      throw new Error('Invalid Renavam. It must be 11 digits long.')
    }
    this.value = value
  }

  private static validate(value: string): boolean {
    // Verifica se tem 11 dígitos
    return /^[0-9]{11}$/.test(value)
  }

  toValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  equals(other: Renavam): boolean {
    return this.value === other.value
  }
}

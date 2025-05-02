export class Cnh {
  private readonly value: string

  constructor(cnh: string) {
    if (!this.validate(cnh)) {
      throw new Error('Invalid CNH format.')
    }

    this.value = cnh
  }

  private validate(cnh: string): boolean {
    if (!/^\d{11}$/.test(cnh)) {
      return false
    }

    if (/^(\d)\1+$/.test(cnh)) {
      return false
    }

    const digits = cnh.split('').map(Number)

    let dsc = 0
    let sum = 0

    for (let i = 0, j = 9; i < 9; i++, j--) {
      sum += digits[i] * j
    }

    let dv1 = sum % 11
    if (dv1 >= 10) {
      dv1 = 0
      dsc = 2
    }

    sum = 0
    for (let i = 0, j = 1; i < 9; i++, j++) {
      sum += digits[i] * j
    }

    let dv2 = (sum - dsc) % 11
    if (dv2 >= 10) {
      dv2 = 0
    }

    return dv1 === digits[9] && dv2 === digits[10]
  }

  toValue(): string {
    return this.value
  }

  equals(other: Cnh): boolean {
    return this.value === other.toValue()
  }

  toString(): string {
    return this.value
  }
}

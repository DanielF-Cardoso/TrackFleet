export class Cnh {
  private readonly value: string

  constructor(cnh: string) {
    if (!this.validate(cnh)) {
      throw new Error('Invalid CNH format.')
    }

    this.value = cnh
  }

  private validate(cnh: string): boolean {
    if (!/^\d{11}$/.test(cnh)) return false

    if (/^(\d)\1{10}$/.test(cnh)) return false

    const nums = cnh.split('').map(Number)

    let sum1 = 0
    for (let i = 0, w = 9; i < 9; i++, w--) {
      sum1 += nums[i] * w
    }
    let dv1 = ((sum1 % 11) + 11) % 11
    if (dv1 === 0 || dv1 === 1) dv1 = 0

    let sum2 = 0
    for (let i = 0, w = 1; i < 9; i++, w++) {
      sum2 += nums[i] * w
    }
    let dv2 = ((sum2 % 11) + 11) % 11
    if (dv1 === 0) {
      dv2 = dv2 - 2 < 0 ? dv2 + 9 : dv2 - 2
    }
    if (dv2 === 0 || dv2 === 1) dv2 = 0

    return dv1 === nums[9] && dv2 === nums[10]
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

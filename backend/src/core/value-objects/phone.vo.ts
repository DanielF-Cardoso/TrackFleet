export class Phone {
  private readonly value: string

  constructor(phone: string) {
    if (!this.validate(phone)) {
      throw new Error('Invalid phone format.')
    }

    this.value = this.format(phone)
  }

  private validate(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '')

    if (cleanPhone.length !== 11) {
      return false
    }

    const ddd = cleanPhone.substring(0, 2)
    if (!/^[1-9][0-9]$/.test(ddd)) {
      return false
    }

    const firstDigit = cleanPhone.charAt(2)
    if (!/^[2-9]$/.test(firstDigit)) {
      return false
    }

    return true
  }

  private format(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  toValue(): string {
    return this.value
  }

  equals(other: Phone): boolean {
    return this.value === other.toValue()
  }

  toString(): string {
    return this.value
  }
}

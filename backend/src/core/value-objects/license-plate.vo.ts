export class LicensePlate {
  private readonly value: string

  constructor(plate: string) {
    const clanedPlate = plate.replace(/[^A-Z0-9]/g, '')
    if (!this.validate(clanedPlate)) {
      throw new Error('Invalid license plate')
    }
    this.value = clanedPlate
  }

  private validate(plate: string): boolean {
    return (
      // Padrão brasileiro: ABC1234 ou BRA1A23 (Mercosul)
      /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate) ||
      /^[A-Z]{3}[0-9]{4}$/.test(plate)
    )
  }

  toValue(): string {
    return this.value
  }

  toFormatted(): string {
    // Ex: ABC1234 → ABC-1234
    return this.value.length === 7
      ? `${this.value.slice(0, 3)}-${this.value.slice(3)}`
      : this.value
  }

  equals(plate: LicensePlate): boolean {
    return this.value === plate.toValue()
  }
}

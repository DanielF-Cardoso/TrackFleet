export class Address {
  constructor(
    private readonly street: string,
    private readonly number: number,
    private readonly district: string,
    private readonly zipCode: string,
    private readonly city: string,
    private readonly state: string,
  ) {
    if (!street || !number || !district || !zipCode || !city || !state) {
      throw new Error('All address fields are required.')
    }

    if (number <= 0) {
      throw new Error('Number must be greater than 0.')
    }

    const cleanZipCode = zipCode.replace(/\D/g, '')
    if (cleanZipCode.length !== 8) {
      throw new Error('Zip code must be 8 digits long.')
    }

    this.zipCode = cleanZipCode
  }

  public getStreet() {
    return this.street
  }

  public getNumber() {
    return this.number
  }

  public getDistrict() {
    return this.district
  }

  public getCity() {
    return this.city
  }

  public getState() {
    return this.state
  }

  public getZipCode() {
    return this.zipCode
  }

  public toValue() {
    return {
      street: this.street,
      number: this.number,
      district: this.district,
      zipCode: this.zipCode,
      city: this.city,
      state: this.state,
    }
  }

  public toString(): string {
    return `${this.street}, ${this.number}, ${this.district}, ${this.zipCode}, ${this.city}, ${this.state}`
  }

  public equals(other: Address): boolean {
    return JSON.stringify(this.toValue()) === JSON.stringify(other.toValue())
  }
}

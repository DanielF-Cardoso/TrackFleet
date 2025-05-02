export class Address {
  constructor(
    private readonly street: string,
    private readonly number: number,
    private readonly district: string,
    private readonly city: string,
    private readonly state: string,
  ) {
    if (!street || !district || !city || !state || !number) {
      throw new Error('All address fields are required.')
    }

    if (number <= 0) {
      throw new Error('Number must be greater than 0.')
    }
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

  public toValue() {
    return {
      street: this.street,
      number: this.number,
      district: this.district,
      city: this.city,
      state: this.state,
    }
  }

  public toString(): string {
    return `${this.street}, ${this.number}, ${this.district}, ${this.city}, ${this.state}`
  }

  public equals(other: Address): boolean {
    return JSON.stringify(this.toValue()) === JSON.stringify(other.toValue())
  }
}

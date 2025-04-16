export class Name {
    private firstName: string
    private lastName: string
  
    constructor(firstName: string, lastName: string) {
      if (!firstName || firstName.trim().length < 2) {
        throw new Error('First name must be at least 2 characters long.')
      }
  
      if (!lastName || lastName.trim().length < 2) {
        throw new Error('Last name must be at least 2 characters long.')
      }
  
      this.firstName = firstName.trim()
      this.lastName = lastName.trim()
    }
  
    public getFullName() {
      return `${this.firstName} ${this.lastName}`
    }
  
    public getFirstName() {
      return this.firstName
    }
  
    public getLastName() {
      return this.lastName
    }
  
    public equals(name: Name): boolean {
      return (
        this.firstName.toLowerCase() === name.getFirstName().toLowerCase() &&
        this.lastName.toLowerCase() === name.getLastName().toLowerCase()
      )
    }
  
    public toValue(): string {
      return this.getFullName()
    }
  }
  
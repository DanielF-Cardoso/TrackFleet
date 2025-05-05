import { Phone } from './phone.vo'

describe('Phone Value Object', () => {
  it('should create a valid phone number', () => {
    const phone = new Phone('77991862828')
    expect(phone.toValue()).toBe('77991862828')
  })

  it('should format phone number by removing non-numeric characters', () => {
    const phone = new Phone('(77) 99186-2828')
    expect(phone.toValue()).toBe('77991862828')
  })

  it('should throw error for phone with invalid length', () => {
    expect(() => new Phone('7799186282')).toThrow('Invalid phone format.')
    expect(() => new Phone('779918628282')).toThrow('Invalid phone format.')
  })

  it('should throw error for invalid DDD', () => {
    expect(() => new Phone('00991862828')).toThrow('Invalid phone format.')
    expect(() => new Phone('00991862828')).toThrow('Invalid phone format.')
  })

  it('should throw error for invalid phone number', () => {
    expect(() => new Phone('77191862828')).toThrow('Invalid phone format.')
  })

  it('should compare two phone numbers', () => {
    const phone1 = new Phone('77991862828')
    const phone2 = new Phone('77991862828')
    const phone3 = new Phone('77991862829')

    expect(phone1.equals(phone2)).toBe(true)
    expect(phone1.equals(phone3)).toBe(false)
  })
})

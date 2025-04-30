import { Cnh } from './cnh.vo'

describe('Cnh Value Object', () => {
  it('should accept a valid CNH', () => {
    const validCnh = '04128959944'
    expect(new Cnh(validCnh).toValue()).toBe(validCnh)
  })

  it('should reject CNH with length other than 11 digits', () => {
    expect(() => new Cnh('123')).toThrow('Invalid CNH format.')
    expect(() => new Cnh('123456789012')).toThrow('Invalid CNH format.')
  })

  it('should reject CNH containing non-numeric characters', () => {
    expect(() => new Cnh('ABCDEFGHIJK')).toThrow('Invalid CNH format.')
  })

  it('should reject CNH with invalid check digits', () => {
    expect(() => new Cnh('12345678900')).toThrow('Invalid CNH format.')
    expect(() => new Cnh('52798802311')).toThrow('Invalid CNH format.')
  })
})

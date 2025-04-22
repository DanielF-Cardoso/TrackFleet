import { Renavam } from './renavam.vo'

describe('Renavam Value Object', () => {
  it('should create a valid Renavam', () => {
    const renavam = new Renavam('12345678901')
    expect(renavam.toValue()).toBe('12345678901')
  })

  it('should throw an error for invalid Renavam', () => {
    expect(() => new Renavam('1234567890')).toThrow()
    expect(() => new Renavam('')).toThrow()
  })

  it('should consider equal Renavam as equal', () => {
    const renavam1 = new Renavam('12345678901')
    const renavam2 = new Renavam('12345678901')
    expect(renavam1.equals(renavam2)).toBe(true)
  })
})

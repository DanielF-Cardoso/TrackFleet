import { Cnh } from '@/core/value-objects/cnh.vo'

describe('Cnh VO', () => {
  it('should accept a valid CNH', () => {
    const cnh = new Cnh('77508373790')
    expect(cnh.toValue()).toBe('77508373790')
  })

  it('should throw error for CNH with wrong length', () => {
    expect(() => new Cnh('123')).toThrowError('Invalid CNH format.')
  })

  it('should throw error for CNH with non-numeric characters', () => {
    expect(() => new Cnh('abcdefghijk')).toThrowError('Invalid CNH format.')
  })

  it('should throw error for CNH with all digits the same', () => {
    expect(() => new Cnh('11111111111')).toThrowError('Invalid CNH format.')
  })

  it('should throw error for CNH with invalid checksum', () => {
    expect(() => new Cnh('12345678911')).toThrowError('Invalid CNH format.')
  })
})

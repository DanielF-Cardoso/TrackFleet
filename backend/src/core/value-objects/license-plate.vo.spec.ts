import { LicensePlate } from './license-plate.vo'

describe('License Plate Value Object', () => {
  it('should create a valid license plate', () => {
    const plate = new LicensePlate('ABC1234')
    expect(plate.toValue()).toBe('ABC1234')
  })

  it('should create a valid MERCOSUL plate', () => {
    const plate = new LicensePlate('BRA1A23')
    expect(plate.toValue()).toBe('BRA1A23')
  })

  it('should format a plate', () => {
    const plate = new LicensePlate('ABC1234')
    expect(plate.toFormatted()).toBe('ABC-1234')
  })

  it('should throw an error for invalid license plate', () => {
    expect(() => new LicensePlate('1234ABC')).toThrow()
    expect(() => new LicensePlate('AB1234')).toThrow()
    expect(() => new LicensePlate('')).toThrow()
  })

  it('should consider equal plates as equal', () => {
    const plate1 = new LicensePlate('ABC1234')
    const plate2 = new LicensePlate('ABC1234')
    expect(plate1.equals(plate2)).toBe(true)
  })
})

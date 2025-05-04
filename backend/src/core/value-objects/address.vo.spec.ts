import { Address } from './address.vo'

describe('Address Value Object', () => {
  it('should create a valid address', () => {
    const address = new Address(
      'Street',
      1,
      'District',
      '00000000',
      'CITY',
      'STATE',
    )
    expect(address.getStreet()).toBe('Street')
    expect(address.getNumber()).toBe(1)
    expect(address.getDistrict()).toBe('District')
    expect(address.getZipCode()).toBe('00000000')
    expect(address.getCity()).toBe('CITY')
    expect(address.getState()).toBe('STATE')
  })

  it('should clean and validate CEP', () => {
    const address1 = new Address(
      'Street',
      1,
      'District',
      '00000-000',
      'CITY',
      'STATE',
    )
    expect(address1.getZipCode()).toBe('00000000')

    const address2 = new Address(
      'Street',
      1,
      'District',
      '00000 000',
      'CITY',
      'STATE',
    )
    expect(address2.getZipCode()).toBe('00000000')

    expect(
      () => new Address('Street', 1, 'District', '00000', 'CITY', 'STATE'),
    ).toThrow('Zip code must be 8 digits long.')

    expect(
      () => new Address('Street', 1, 'District', '000000000', 'CITY', 'STATE'),
    ).toThrow('Zip code must be 8 digits long.')
  })

  it('should return formatted string', () => {
    const address = new Address(
      'Street',
      1,
      'District',
      '00000000',
      'CITY',
      'STATE',
    )
    expect(address.toString()).toBe(
      'Street, 1, District, 00000000, CITY, STATE',
    )
  })

  it('should throw error on missing values', () => {
    expect(
      () => new Address('', 1, 'District', '00000000', 'CITY', 'STATE'),
    ).toThrow()
    expect(
      () => new Address('Street', -1, 'District', '00000000', 'CITY', 'STATE'),
    ).toThrow()
  })

  it('should consider two address with the same value as equal', () => {
    const address = new Address(
      'Street',
      1,
      'District',
      '00000000',
      'CITY',
      'STATE',
    )
    const address2 = new Address(
      'Street',
      1,
      'District',
      '00000000',
      'CITY',
      'STATE',
    )

    expect(address.equals(address2)).toBe(true)
  })

  it('should consider two address with different values as not equal', () => {
    const address = new Address(
      'Street',
      1,
      'District',
      '00000000',
      'CITY',
      'STATE',
    )
    const address2 = new Address(
      'Street',
      2,
      'District',
      '00000000',
      'CITY',
      'STATE',
    )
    expect(address.equals(address2)).toBe(false)
  })
})

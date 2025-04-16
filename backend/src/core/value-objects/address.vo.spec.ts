import { describe, it, expect } from 'vitest'
import { Address } from './address.vo'

describe('Address Value Object', () => {
  it('should create a valid address', () => {
    const address = new Address('Street', 1, 'District', 'CITY', 'STATE')

    expect(address.getStreet()).toBe('Street')
    expect(address.getNumber()).toBe(1)
    expect(address.getDistrict()).toBe('District')
    expect(address.getCity()).toBe('CITY')
    expect(address.getState()).toBe('STATE')
  })

  it('should return formatted string', () => {
    const address = new Address('Street', 1, 'District', 'CITY', 'STATE')

    expect(address.toString()).toBe('Street, 1, District, CITY, STATE')
  })

  it('shoud throw error a missing values', () => {
    expect(() => new Address('', 1, 'District', 'CITY', 'STATE')).toThrow()
    expect(
      () => new Address('Street', -1, 'District', 'CITY', 'STATE'),
    ).toThrow()
  })

  it('should consider two address with the same value as equal', () => {
    const address = new Address('Street', 1, 'District', 'CITY', 'STATE')
    const address2 = new Address('Street', 1, 'District', 'CITY', 'STATE')

    expect(address.equals(address2)).toBe(true)
  })

  it('should consider two address with different values as not equal', () => {
    const address = new Address('Street', 1, 'District', 'CITY', 'STATE')
    const address2 = new Address('Street', 2, 'District', 'CITY', 'STATE')

    expect(address.equals(address2)).toBe(false)
  })
})

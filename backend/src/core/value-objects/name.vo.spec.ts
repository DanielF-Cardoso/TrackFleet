import { describe, it, expect } from 'vitest'
import { Name } from './name.vo'

describe('Name Value Object', () => {
  it('should create a valid name', () => {
    const name = new Name('John', 'Doe')

    expect(name).toBeInstanceOf(Name)
    expect(name.getFullName()).toBe('John Doe')
  })

  it('should trim and store first and last name correctly', () => {
    const name = new Name('  John  ', '  Doe  ')

    expect(name.getFirstName()).toBe('John')
    expect(name.getLastName()).toBe('Doe')
  })

  it('should throw an error if first name is too short', () => {
    expect(() => new Name('J', 'Doe')).toThrowError(
      'First name must be at least 2 characters long.',
    )
  })

  it('should throw an error if last name is too short', () => {
    expect(() => new Name('John', 'D')).toThrowError(
      'Last name must be at least 2 characters long.',
    )
  })

  it('should consider two names with same values as equal (case insensitive)', () => {
    const name1 = new Name('John', 'Doe')
    const name2 = new Name('john', 'DOE')

    expect(name1.equals(name2)).toBe(true)
  })

  it('should consider two names with different values as not equal', () => {
    const name1 = new Name('John', 'Doe')
    const name2 = new Name('Joel', 'Smith')

    expect(name1.equals(name2)).toBe(false)
  })
})

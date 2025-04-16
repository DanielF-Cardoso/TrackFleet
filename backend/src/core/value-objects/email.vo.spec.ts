import { describe, it, expect } from 'vitest'
import { Email } from './email.vo'

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = new Email('example@email.com')

    expect(email).toBeInstanceOf(Email)
    expect(email.toValue()).toBe('example@email.com')
  })

  it('should normalize email to lowercase', () => {
    const email = new Email('Example@Email.COM')

    expect(email.toValue()).toBe('example@email.com')
  })

  it('should throw an error for an invalid email', () => {
    expect(() => new Email('invalid_email')).toThrowError('Invalid email format.')
    expect(() => new Email('')).toThrowError('Invalid email format.')
    expect(() => new Email('a@b')).toThrowError('Invalid email format.')
  })

  it('should consider two emails with the same value as equal', () => {
    const email1 = new Email('test@email.com')
    const email2 = new Email('test@email.com')

    expect(email1.equals(email2)).toBe(true)
  })

  it('should consider two emails with different values as not equal', () => {
    const email1 = new Email('one@email.com')
    const email2 = new Email('two@email.com')

    expect(email1.equals(email2)).toBe(false)
  })
})

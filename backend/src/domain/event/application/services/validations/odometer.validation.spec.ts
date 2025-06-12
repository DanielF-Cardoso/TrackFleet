import { describe, it, expect } from 'vitest'
import { OdometerValidation } from './odometer.validation'

describe('OdometerValidation', () => {
  describe('validate', () => {
    it('should allow 10% increase for any car', () => {
      const currentOdometer = 1000
      const newOdometer = 1100

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(true)
    })

    it('should not allow more than 10% increase for any car', () => {
      const currentOdometer = 1000
      const newOdometer = 1101

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(false)
    })

    it('should allow 10% increase for small odometer', () => {
      const currentOdometer = 100
      const newOdometer = 110

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(true)
    })

    it('should not allow more than 10% increase for small odometer', () => {
      const currentOdometer = 100
      const newOdometer = 111

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(false)
    })

    it('should not allow odometer to decrease', () => {
      const currentOdometer = 1000
      const newOdometer = 999

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(false)
    })

    it('should allow exact same odometer value', () => {
      const currentOdometer = 1000
      const newOdometer = 1000

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(true)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { OdometerValidation } from './odometer.validation'

describe('OdometerValidation', () => {
  describe('validate', () => {
    it('should allow 10% increase for cars with less than 1000km', () => {
      const currentOdometer = 100
      const newOdometer = 110

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(true)
    })

    it('should not allow more than 10% increase for cars with less than 1000km', () => {
      const currentOdometer = 100
      const newOdometer = 111

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(false)
    })

    it('should allow 5% increase for cars with more than 1000km', () => {
      const currentOdometer = 100000
      const newOdometer = 105000

      const result = OdometerValidation.validate(currentOdometer, newOdometer)

      expect(result).toBe(true)
    })

    it('should not allow more than 5% increase for cars with more than 1000km', () => {
      const currentOdometer = 100000
      const newOdometer = 105001

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

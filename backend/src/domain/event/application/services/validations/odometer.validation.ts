export class OdometerValidation {
  static validate(currentOdometer: number, newOdometer: number): boolean {
    if (newOdometer < currentOdometer) {
      return false
    }

    if (currentOdometer < 1000) {
      const maxDifference = currentOdometer * 0.1 // 10% about the current odometer
      return newOdometer <= currentOdometer + maxDifference
    }

    const maxDifference = currentOdometer * 0.05 // 5% about the current odometer
    return newOdometer <= currentOdometer + maxDifference
  }
}

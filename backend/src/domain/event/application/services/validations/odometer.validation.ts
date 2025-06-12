export class OdometerValidation {
  static validate(currentOdometer: number, newOdometer: number): boolean {
    if (newOdometer < currentOdometer) {
      return false
    }
    const maxDifference = currentOdometer * 0.1 // 10% of the current odometer
    return newOdometer <= currentOdometer + maxDifference
  }
}

import { Car } from '@/domain/cars/enterprise/entities/car.entity'

export class CarPresenter {
  static toHTTP(car: Car) {
    return {
      id: car.id.toString(),
      managerId: car.managerId.toString(),
      licensePlate: car.licensePlate.toValue(),
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      odometer: car.odometer,
      status: car.status,
      renavam: car.renavam.toValue(),
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    }
  }
}

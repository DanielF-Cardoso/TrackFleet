import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { Car } from '@/domain/cars/enterprise/entities/car.entity'

export class InMemoryCarRepository implements CarRepository {
  public items: Car[] = []

  async findById(id: string): Promise<Car | null> {
    const car = this.items.find((item) => item.id.toString() === id)
    return car || null
  }

  async findByLicensePlate(licensePlate: string): Promise<Car | null> {
    const car = this.items.find(
      (item) => item.licensePlate.toValue() === licensePlate,
    )
    return car ?? null
  }

  async findByRenavam(renavam: string): Promise<Car | null> {
    const car = this.items.find((item) => item.renavam.toValue() === renavam)
    return car ?? null
  }

  async create(car: Car): Promise<Car> {
    this.items.push(car)
    return car
  }

  async save(car: Car): Promise<Car> {
    const index = this.items.findIndex((item) => item.id.equals(car.id))
    if (index >= 0) {
      this.items[index] = car
    }
    return car
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}

import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { CreateCarService } from './create-car.service'
import { makeCarInput } from 'test/factories/car/make-car-input'
import { CarAlreadyExistsError } from './errors/car-already-exists-error'

let sut: CreateCarService
let carRepository: InMemoryCarRepository

describe('CreateCarService', () => {
  beforeEach(() => {
    carRepository = new InMemoryCarRepository()
    sut = new CreateCarService(carRepository)
  })

  it('should be able to create a new car', async () => {
    const carData = makeCarInput()

    const result = await sut.execute(carData)

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const { car } = result.value
      expect(car.licensePlate.toValue()).toBe(carData.licensePlate)
      expect(car.brand).toBe(carData.brand)
      expect(car.model).toBe(carData.model)
      expect(car.year).toBe(carData.year)
      expect(car.color).toBe(carData.color)
      expect(car.odometer).toBe(carData.odometer)
      expect(car.renavam).toBe(carData.renavam)
    }
  })

  it('should not allow creating a car with same license plate', async () => {
    const carData = makeCarInput({ licensePlate: 'ABC1234' })

    await sut.execute(carData)
    const result = await sut.execute(carData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CarAlreadyExistsError)
  })
})

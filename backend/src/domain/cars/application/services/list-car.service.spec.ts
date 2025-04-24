import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { I18nService } from 'nestjs-i18n'
import { makeCar } from 'test/factories/car/make-car'
import { CarNotFoundError } from './errors/car-not-found'
import { ListCarService } from './list-car.service'

let sut: ListCarService
let carRepository: InMemoryCarRepository
let i18n: I18nService

beforeEach(() => {
  carRepository = new InMemoryCarRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  sut = new ListCarService(carRepository, i18n)
})

describe('ListCarService', () => {
  it('should be able to return all cars', async () => {
    const carData = makeCar()
    await carRepository.create(carData)

    const carData2 = makeCar()
    await carRepository.create(carData2)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.findedAll).toHaveLength(2)
      expect(result.value.findedAll[0].licensePlate).toBe(carData.licensePlate)
      expect(result.value.findedAll[1].licensePlate).toBe(carData2.licensePlate)
    }
  })

  it('should return an error if no cars are found', async () => {
    const errorMessage = 'No cars found'
    vi.spyOn(i18n, 'translate').mockResolvedValue(errorMessage)

    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(CarNotFoundError)
      expect(result.value.message).toBe(errorMessage)
    }
  })
})

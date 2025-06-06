import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { I18nService } from 'nestjs-i18n'
import { makeCar } from 'test/factories/car/make-car'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ListCarService } from './list-car.service'
import { FakeLogger } from 'test/fake/logs-mocks'

let sut: ListCarService
let carRepository: InMemoryCarRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  carRepository = new InMemoryCarRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new ListCarService(carRepository, i18n, logger)
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
      expect(result.value.cars).toHaveLength(2)
      expect(result.value.cars[0].licensePlate).toBe(carData.licensePlate)
      expect(result.value.cars[1].licensePlate).toBe(carData2.licensePlate)
    }
  })

  it('should return an error if no cars are found', async () => {
    const errorMessage = 'No cars found'
    vi.spyOn(i18n, 'translate').mockResolvedValue(errorMessage)

    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe(errorMessage)
    }
  })
})

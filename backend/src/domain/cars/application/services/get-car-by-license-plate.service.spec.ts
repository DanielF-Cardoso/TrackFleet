import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { I18nService } from 'nestjs-i18n'
import { makeCar } from 'test/factories/car/make-car'
import { GetCarByLicensePlateService } from './get-car-by-license-plate'
import { FakeLogger } from 'test/fake/logs-mocks'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

let sut: GetCarByLicensePlateService
let carRepository: InMemoryCarRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  carRepository = new InMemoryCarRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new GetCarByLicensePlateService(carRepository, i18n, logger)
})

describe('GetCarByLicensePlateService', () => {
  it('should be able to get by a car license plate', async () => {
    const carData = makeCar({ licensePlate: 'ABC1234' })
    await carRepository.create(carData)

    const result = await sut.execute({ licensePlate: 'ABC1234' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.car).toEqual(carData)
    }
  })
  it('should not be able to get a car by license plate', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Car not found.')

    const result = await sut.execute({
      licensePlate: 'non-existing-license-plate',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Car not found.')
    }
  })
})

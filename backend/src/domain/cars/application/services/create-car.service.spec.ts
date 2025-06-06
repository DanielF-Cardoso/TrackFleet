import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { CreateCarService } from './create-car.service'
import { makeCarInput } from 'test/factories/car/make-car-input'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { LicensePlateAlreadyExistsError } from './errors/license-plate-already-exists.error'
import { RenavamAlreadyExistsError } from './errors/renavam-already-exists.error'

let sut: CreateCarService
let carRepository: InMemoryCarRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  carRepository = new InMemoryCarRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new CreateCarService(carRepository, i18n, logger)
})

describe('CreateCarService', () => {
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
      expect(car.renavam.toValue()).toBe(carData.renavam)
    }
  })

  it('should not allow creating a car with the same license plate', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A car with this license plate already exists.',
    )

    const licensePlate = 'ABC1234'
    const carData = makeCarInput({
      licensePlate,
      renavam: '12345678901',
    })

    await sut.execute(carData)
    const result = await sut.execute(
      makeCarInput({
        licensePlate,
        renavam: '98765432109', // Renavam diferente
      }),
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(LicensePlateAlreadyExistsError)
    if (result.value instanceof LicensePlateAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A car with this license plate already exists.',
      )
    }
  })

  it('should not allow creating a car with the same Renavam', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A car with this Renavam already exists.',
    )

    const carData = makeCarInput({
      renavam: '12345678901',
      licensePlate: 'ABK1238',
    })

    await sut.execute(carData)
    const result = await sut.execute(carData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RenavamAlreadyExistsError)
    if (result.value instanceof RenavamAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A car with this Renavam already exists.',
      )
    }
  })
})

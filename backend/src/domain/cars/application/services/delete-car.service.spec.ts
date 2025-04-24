import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { I18nService } from 'nestjs-i18n'
import { DeleteCarService } from './delete-car.service'
import { makeCar } from 'test/factories/car/make-car'
import { CarNotFoundError } from './errors/car-not-found'

let sut: DeleteCarService
let carRepository: InMemoryCarRepository
let i18n: I18nService

beforeEach(() => {
  carRepository = new InMemoryCarRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  sut = new DeleteCarService(carRepository, i18n)
})

describe('DeleteCarService', () => {
  it('should be able to delete a car', async () => {
    const carData = makeCar()
    await carRepository.create(carData)
    const carId = carData.id.toString()

    const result = await sut.execute({ carId })

    expect(result.isRight()).toBe(true)
    expect(carRepository.items).toHaveLength(0)
  })
  it('should not be able to delete a car that does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Car not found.')

    const result = await sut.execute({ carId: 'non-existing-car-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CarNotFoundError)
    if (result.value instanceof CarNotFoundError) {
      expect(result.value.message).toBe('Car not found.')
    }
  })
})

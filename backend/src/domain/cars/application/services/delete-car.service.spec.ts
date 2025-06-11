import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { I18nService } from 'nestjs-i18n'
import { DeleteCarService } from './delete-car.service'
import { makeCar } from 'test/factories/car/make-car'
import { FakeLogger } from 'test/fake/logs-mocks'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { makeEvent } from 'test/factories/event/make-event'

let sut: DeleteCarService
let carRepository: InMemoryCarRepository
let eventRepository: InMemoryEventRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  carRepository = new InMemoryCarRepository()
  eventRepository = new InMemoryEventRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new DeleteCarService(carRepository, i18n, logger, eventRepository)
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
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Car not found.')
    }
  })
  it('should not be able to delete a car that has events', async () => {
    const carData = makeCar()
    await carRepository.create(carData)
    const carId = carData.id.toString()

    const event = makeEvent({ carId: carData.id })
    await eventRepository.create(event)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Car has events and cannot be deleted.',
    )

    const result = await sut.execute({ carId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
    if (result.value instanceof Error) {
      expect(result.value.message).toBe('Car has events and cannot be deleted.')
    }
  })
})

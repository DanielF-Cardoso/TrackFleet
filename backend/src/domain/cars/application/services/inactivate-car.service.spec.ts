import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { I18nService } from 'nestjs-i18n'
import { makeCar } from 'test/factories/car/make-car'
import { makeEvent } from 'test/factories/event/make-event'
import { FakeLogger } from 'test/fake/logs-mocks'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { CarHasEventsError } from './errors/car-has-events-error'
import { InactivateCarService } from './inactivate-car.service'

let sut: InactivateCarService
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

  sut = new InactivateCarService(carRepository, i18n, logger, eventRepository)
})

describe('InactivateCarService', () => {
  it('should be able to inactivate a car', async () => {
    const car = makeCar()
    await carRepository.create(car)
    const carId = car.id.toString()

    const result = await sut.execute({ carId })

    expect(result.isRight()).toBe(true)
    const updatedCar = await carRepository.findById(carId)
    expect(updatedCar?.isActive).toBe(false)
    expect(updatedCar?.inactiveAt).toBeInstanceOf(Date)
  })

  it('should not be able to inactivate a car that does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Car not found.')

    const result = await sut.execute({ carId: 'non-existing-car-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Car not found.')
    }
  })

  it('should not be able to inactivate a car that is in use (has event with status EXIT)', async () => {
    const car = makeCar()
    await carRepository.create(car)
    const carId = car.id.toString()

    const event = makeEvent({ carId: car.id, status: 'EXIT' })
    await eventRepository.create(event)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Car has events and cannot be inactivated.',
    )

    const result = await sut.execute({ carId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CarHasEventsError)
    if (result.value instanceof CarHasEventsError) {
      expect(result.value.message).toBe(
        'Car has events and cannot be inactivated.',
      )
    }
  })
})

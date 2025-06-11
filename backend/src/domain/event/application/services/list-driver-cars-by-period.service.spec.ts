import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ListDriverCarsByPeriodService } from './list-driver-cars-by-period.service'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { makeEvent } from 'test/factories/event/make-event'
import { makeCar } from 'test/factories/car/make-car'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let sut: ListDriverCarsByPeriodService
let eventRepository: InMemoryEventRepository
let carRepository: InMemoryCarRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  eventRepository = new InMemoryEventRepository()
  carRepository = new InMemoryCarRepository()
  logger = new FakeLogger()
  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  sut = new ListDriverCarsByPeriodService(
    eventRepository,
    carRepository,
    i18n,
    logger,
  )
})

describe('ListDriverCarsByPeriodService', () => {
  it('should return cars used by the driver in the given period', async () => {
    const car1 = makeCar()
    const car2 = makeCar()
    await carRepository.create(car1)
    await carRepository.create(car2)

    const driverId = 'driver-1'
    const event1 = makeEvent({
      carId: car1.id,
      driverId: new UniqueEntityID(driverId),
      startAt: new Date('2024-01-10'),
    })
    const event2 = makeEvent({
      carId: car2.id,
      driverId: new UniqueEntityID(driverId),
      startAt: new Date('2024-01-15'),
    })
    const event3 = makeEvent({
      carId: car1.id,
      driverId: new UniqueEntityID('other-driver'),
      startAt: new Date('2024-01-20'),
    })

    await eventRepository.create(event1)
    await eventRepository.create(event2)
    await eventRepository.create(event3)

    const result = await sut.execute({
      driverId,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.cars.length).toBe(2)
      expect(result.value.cars).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: car1.id }),
          expect.objectContaining({ id: car2.id }),
        ]),
      )
    }
  })

  it('should return ResourceNotFoundError if no cars found for driver in the period', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('No events found.')

    const result = await sut.execute({
      driverId: 'driver-2',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('No events found.')
    }
  })
})

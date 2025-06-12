import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ListUsedCarsByPeriodService } from './list-used-cars-by-period.service'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'
import { makeEvent } from 'test/factories/event/make-event'
import { makeCar } from 'test/factories/car/make-car'
import { makeDriver } from 'test/factories/driver/make-driver'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { FakeLogger } from 'test/fake/logs-mocks'

let sut: ListUsedCarsByPeriodService
let eventRepository: InMemoryEventRepository
let carRepository: InMemoryCarRepository
let driverRepository: InMemoryDriverRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  eventRepository = new InMemoryEventRepository()
  carRepository = new InMemoryCarRepository()
  driverRepository = new InMemoryDriverRepository()
  logger = new FakeLogger()
  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService
  sut = new ListUsedCarsByPeriodService(
    eventRepository,
    i18n,
    carRepository,
    driverRepository,
    logger,
  )
})

describe('ListUsedCarsByPeriodService', () => {
  it('should list events with car and driver details within the given period', async () => {
    const car1 = makeCar()
    const car2 = makeCar()
    const driver1 = makeDriver()
    const driver2 = makeDriver()
    const managerId = 'manager-1'

    await carRepository.create(car1)
    await carRepository.create(car2)
    await driverRepository.create(driver1)
    await driverRepository.create(driver2)

    const event1 = makeEvent({
      carId: car1.id,
      driverId: driver1.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 1000,
      status: 'EXIT',
      startAt: new Date('2024-01-10'),
    })

    const event2 = makeEvent({
      carId: car2.id,
      driverId: driver2.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 2000,
      status: 'ENTRY',
      startAt: new Date('2024-01-15'),
    })

    const event3 = makeEvent({
      carId: car2.id,
      driverId: driver2.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 3000,
      status: 'ENTRY',
      startAt: new Date('2024-02-01'),
    })

    await eventRepository.create(event1)
    await eventRepository.create(event2)
    await eventRepository.create(event3)

    const result = await sut.execute({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const { events } = result.value
      expect(events).toHaveLength(2)
      expect(events).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            event: expect.objectContaining({
              id: event1.id,
              carId: car1.id,
              driverId: driver1.id,
              odometer: 1000,
              status: 'EXIT',
            }),
            car: expect.objectContaining({
              id: car1.id,
              licensePlate: car1.licensePlate,
              model: car1.model,
              brand: car1.brand,
            }),
            driver: expect.objectContaining({
              id: driver1.id,
            }),
          }),
          expect.objectContaining({
            event: expect.objectContaining({
              id: event2.id,
              carId: car2.id,
              driverId: driver2.id,
              odometer: 2000,
              status: 'ENTRY',
            }),
            car: expect.objectContaining({
              id: car2.id,
              licensePlate: car2.licensePlate,
              model: car2.model,
              brand: car2.brand,
            }),
            driver: expect.objectContaining({
              id: driver2.id,
            }),
          }),
        ]),
      )
    }
  })

  it('should return ResourceNotFoundError if no events in the period', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('No events found.')

    const result = await sut.execute({
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

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ListEventsService } from './list-events.service'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { makeEvent } from 'test/factories/event/make-event'
import { makeCar } from 'test/factories/car/make-car'
import { makeDriver } from 'test/factories/driver/make-driver'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

let sut: ListEventsService
let eventRepository: InMemoryEventRepository
let i18n: I18nService

beforeEach(() => {
  eventRepository = new InMemoryEventRepository()
  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService
  sut = new ListEventsService(eventRepository, i18n)
})

describe('ListEventsService', () => {
  it('should be able to list all events', async () => {
    const car1 = makeCar()
    const car2 = makeCar()
    const driver1 = makeDriver()
    const driver2 = makeDriver()
    const managerId = 'manager-1'

    const event1 = makeEvent({
      carId: car1.id,
      driverId: driver1.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 1000,
      status: 'EXIT',
    })

    const event2 = makeEvent({
      carId: car2.id,
      driverId: driver2.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 2000,
      status: 'ENTRY',
    })

    await eventRepository.create(event1)
    await eventRepository.create(event2)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const { events } = result.value
      expect(events).toHaveLength(2)
      expect(events).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: event1.id,
            carId: car1.id,
            driverId: driver1.id,
            odometer: 1000,
            status: 'EXIT',
          }),
          expect.objectContaining({
            id: event2.id,
            carId: car2.id,
            driverId: driver2.id,
            odometer: 2000,
            status: 'ENTRY',
          }),
        ]),
      )
    }
  })

  it('should not be able to list events when there are no events', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('No events found.')

    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('No events found.')
    }
  })
})

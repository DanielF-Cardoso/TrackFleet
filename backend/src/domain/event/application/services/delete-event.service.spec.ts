import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteEventService } from './delete-event.service'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { makeEvent } from 'test/factories/event/make-event'
import { makeCar } from 'test/factories/car/make-car'
import { makeDriver } from 'test/factories/driver/make-driver'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InvalidEventStatusError } from './errors/invalid-event-status.error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

let sut: DeleteEventService
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
  sut = new DeleteEventService(eventRepository, carRepository, i18n, logger)
})

describe('DeleteEventService', () => {
  it('should be able to delete an event and update car status', async () => {
    const car = makeCar()
    const driver = makeDriver()
    const managerId = 'manager-1'

    const event = makeEvent({
      carId: car.id,
      driverId: driver.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 1000,
      status: 'EXIT',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const updatedCar = await carRepository.findById(car.id.toValue())
      const deletedEvent = await eventRepository.findById(event.id.toValue())

      expect(updatedCar?.status).toBe('AVAILABLE')
      expect(deletedEvent).toBeNull()
    }
  })

  it('should not be able to delete a non-existent event', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Event not found.')

    const result = await sut.execute({
      eventId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Event not found.')
    }
  })

  it('should not be able to delete a finalized event', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Cannot delete a finalized event.',
    )

    const car = makeCar()
    const driver = makeDriver()
    const managerId = 'manager-1'

    const event = makeEvent({
      carId: car.id,
      driverId: driver.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 1000,
      status: 'ENTRY',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEventStatusError)
    if (result.value instanceof InvalidEventStatusError) {
      expect(result.value.message).toBe('Cannot delete a finalized event.')
    }
  })

  it('should not be able to delete an event with non-existent car', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Car not found.')

    const driver = makeDriver()
    const managerId = 'manager-1'

    const event = makeEvent({
      carId: new UniqueEntityID('non-existent-car-id'),
      driverId: driver.id,
      managerId: new UniqueEntityID(managerId),
      odometer: 1000,
      status: 'EXIT',
    })

    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Car not found.')
    }
  })
})

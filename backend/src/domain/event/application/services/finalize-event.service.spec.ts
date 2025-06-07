import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FinalizeEventService } from './finalize-event.service'
import { I18nService } from 'nestjs-i18n'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { makeCar } from 'test/factories/car/make-car'
import { makeEvent } from 'test/factories/event/make-event'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EventAlreadyFinalizedError } from './errors/event-already-finalized.error'
import { InvalidOdometerError } from './errors/invalid-odometer.error'
import { LoggerService } from '@nestjs/common'

let sut: FinalizeEventService
let eventRepository: InMemoryEventRepository
let carRepository: InMemoryCarRepository
let i18n: I18nService
let logger: LoggerService

beforeEach(() => {
  eventRepository = new InMemoryEventRepository()
  carRepository = new InMemoryCarRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  sut = new FinalizeEventService(eventRepository, carRepository, i18n, logger)
  logger = {
    log: vi.fn(),
    warn: vi.fn(),
  } as unknown as LoggerService
})

describe('FinalizeEventService', () => {
  it('should be able to finalize an event and update car status', async () => {
    const car = makeCar({ odometer: 1000 })
    const event = makeEvent({
      carId: car.id,
      odometer: 1000,
      status: 'EXIT',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
      odometer: 1050,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const updatedEvent = result.value.event
      const updatedCar = await carRepository.findById(car.id.toValue())

      expect(updatedEvent.status).toBe('ENTRY')
      expect(updatedEvent.endAt).toBeDefined()
      expect(updatedEvent.odometer).toBe(1050)
      expect(updatedCar?.status).toBe('AVAILABLE')
      expect(updatedCar?.odometer).toBe(1050)
    }
  })

  it('should not be able to finalize a non-existent event', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Event not found.')

    const result = await sut.execute({
      eventId: 'non-existent-id',
      odometer: 1050,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Event not found.')
    }
  })

  it('should not be able to finalize an already finalized event', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Event already finalized.')

    const car = makeCar({ odometer: 1000 })
    const event = makeEvent({
      carId: car.id,
      odometer: 1000,
      status: 'ENTRY',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
      odometer: 1050,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EventAlreadyFinalizedError)
    if (result.value instanceof EventAlreadyFinalizedError) {
      expect(result.value.message).toBe('Event already finalized.')
    }
  })

  it('should not be able to finalize an event with odometer less than start odometer', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Invalid odometer value.')

    const car = makeCar({ odometer: 1000 })
    const event = makeEvent({
      carId: car.id,
      odometer: 1000,
      status: 'EXIT',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
      odometer: 900,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOdometerError)
    if (result.value instanceof InvalidOdometerError) {
      expect(result.value.message).toBe('Invalid odometer value.')
    }
  })

  it('should not be able to finalize an event with odometer too high for a low mileage car', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Odometer value is too high.')

    const car = makeCar({ odometer: 100 })
    const event = makeEvent({
      carId: car.id,
      odometer: 100,
      status: 'EXIT',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
      odometer: 150,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOdometerError)
    if (result.value instanceof InvalidOdometerError) {
      expect(result.value.message).toBe('Odometer value is too high.')
    }
  })

  it('should not be able to finalize an event with odometer too high for a high mileage car', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Odometer value is too high.')

    const car = makeCar({ odometer: 100000 })
    const event = makeEvent({
      carId: car.id,
      odometer: 100000,
      status: 'EXIT',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
      odometer: 106000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOdometerError)
    if (result.value instanceof InvalidOdometerError) {
      expect(result.value.message).toBe('Odometer value is too high.')
    }
  })

  it('should be able to finalize an event with reasonable odometer increase for a low mileage car', async () => {
    const car = makeCar({ odometer: 100 })
    const event = makeEvent({
      carId: car.id,
      odometer: 100,
      status: 'EXIT',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
      odometer: 110,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const updatedCar = await carRepository.findById(car.id.toValue())
      expect(updatedCar?.status).toBe('AVAILABLE')
      expect(updatedCar?.odometer).toBe(110)
    }
  })

  it('should be able to finalize an event with reasonable odometer increase for a high mileage car', async () => {
    const car = makeCar({ odometer: 100000 })
    const event = makeEvent({
      carId: car.id,
      odometer: 100000,
      status: 'EXIT',
    })

    await carRepository.create(car)
    await eventRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toValue(),
      odometer: 105000,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const updatedCar = await carRepository.findById(car.id.toValue())
      expect(updatedCar?.status).toBe('AVAILABLE')
      expect(updatedCar?.odometer).toBe(105000)
    }
  })
})

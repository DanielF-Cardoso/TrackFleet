import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ListUsedCarsByPeriodService } from './list-used-cars-by-period.service'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { makeEvent } from 'test/factories/event/make-event'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

let sut: ListUsedCarsByPeriodService
let eventRepository: InMemoryEventRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  eventRepository = new InMemoryEventRepository()
  logger = new FakeLogger()
  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  sut = new ListUsedCarsByPeriodService(eventRepository, i18n, logger)
})

describe('ListUsedCarsByPeriodService', () => {
  it('should return events within the given period', async () => {
    const event1 = makeEvent({ startAt: new Date('2024-01-10') })
    const event2 = makeEvent({ startAt: new Date('2024-01-15') })
    const event3 = makeEvent({ startAt: new Date('2024-02-01') })

    await eventRepository.create(event1)
    await eventRepository.create(event2)
    await eventRepository.create(event3)

    const result = await sut.execute({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.events.length).toBe(2)
      expect(result.value.events).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: event1.id }),
          expect.objectContaining({ id: event2.id }),
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

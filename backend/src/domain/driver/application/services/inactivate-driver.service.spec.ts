import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'
import { InMemoryEventRepository } from 'test/repositories/in-memory-event.repository'
import { I18nService } from 'nestjs-i18n'
import { InactivateDriverService } from './inactivate-driver.service'
import { makeDriver } from 'test/factories/driver/make-driver'
import { makeEvent } from 'test/factories/event/make-event'
import { FakeLogger } from 'test/fake/logs-mocks'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DriverHasActiveEventError } from './errors/driver-has-active-event.error'

let sut: InactivateDriverService
let driverRepository: InMemoryDriverRepository
let eventRepository: InMemoryEventRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  driverRepository = new InMemoryDriverRepository()
  eventRepository = new InMemoryEventRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new InactivateDriverService(
    driverRepository,
    i18n,
    logger,
    eventRepository,
  )
})

describe('InactivateDriverService', () => {
  it('should be able to inactivate a driver', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)
    const driverId = driver.id.toString()

    const result = await sut.execute({ driverId })

    expect(result.isRight()).toBe(true)
    const updatedDriver = await driverRepository.findById(driverId)
    expect(updatedDriver?.isActive).toBe(false)
    expect(updatedDriver?.inactiveAt).toBeInstanceOf(Date)
  })

  it('should not be able to inactivate a driver that does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Driver not found.')

    const result = await sut.execute({ driverId: 'non-existing-driver-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Driver not found.')
    }
  })

  it('should not be able to inactivate a driver that has an active event (status EXIT)', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)
    const driverId = driver.id.toString()

    const event = makeEvent({ driverId: driver.id, status: 'EXIT' })
    await eventRepository.create(event)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Driver has active event and cannot be inactivated.',
    )

    const result = await sut.execute({ driverId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DriverHasActiveEventError)
    if (result.value instanceof DriverHasActiveEventError) {
      expect(result.value.message).toBe(
        'Driver has active event and cannot be inactivated.',
      )
    }
  })
})

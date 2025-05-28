import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { makeDriver } from 'test/factories/driver/make-driver'
import { DeleteDriverService } from './delete-driver.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

let sut: DeleteDriverService
let driverRepository: InMemoryDriverRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  driverRepository = new InMemoryDriverRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new DeleteDriverService(driverRepository, i18n, logger)
})

describe('DeleteDriverService', () => {
  it('should remove a driver', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)

    const result = await sut.execute({ driverId: driver.id.toString() })

    expect(result.isRight()).toBe(true)

    expect(driverRepository.items).toHaveLength(0)
  })

  it('should return error with translated message if driver is not found', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Driver not found.')

    const result = await sut.execute({ driverId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Driver not found.')
    }
  })
})

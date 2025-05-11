import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'

import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { GetDriverProfileService } from './get-driver-profile.service'
import { makeDriver } from 'test/factories/driver/make-driver'
import { DriverNotFoundError } from './errors/driver-not-found'

let sut: GetDriverProfileService
let driverRepository: InMemoryDriverRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  driverRepository = new InMemoryDriverRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new GetDriverProfileService(driverRepository, i18n, logger)
})

describe('GetDriverProfileService', () => {
  it('should return driver profile by id', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)

    const result = await sut.execute({ driverId: driver.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.driver.id.toString()).toBe(driver.id.toString())
      expect(result.value.driver.name.getFirstName()).toBe(
        driver.name.getFirstName(),
      )
    }
  })

  it('should return error with translated message if driver is not found', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Driver not found.')

    const result = await sut.execute({ driverId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DriverNotFoundError)
    if (result.value instanceof DriverNotFoundError) {
      expect(result.value.message).toBe('Driver not found.')
    }
  })
})

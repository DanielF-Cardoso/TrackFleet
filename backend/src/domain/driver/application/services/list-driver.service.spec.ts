import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'
import { makeDriver } from 'test/factories/driver/make-driver'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { ListDriversService } from './list-driver.service'
import { DriverNotFoundError } from './errors/driver-not-found'

let sut: ListDriversService
let driverRepository: InMemoryDriverRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  driverRepository = new InMemoryDriverRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new ListDriversService(driverRepository, i18n, logger)
})

describe('ListDriversService', () => {
  it('should return a list of all drivers', async () => {
    const driver1 = makeDriver()
    const driver2 = makeDriver()
    const driver3 = makeDriver()

    await driverRepository.create(driver1)
    await driverRepository.create(driver2)
    await driverRepository.create(driver3)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.drivers).toHaveLength(3)
      expect(result.value.drivers[0]).toBeInstanceOf(driver1.constructor)
      expect(result.value.drivers[1]).toBeInstanceOf(driver2.constructor)
      expect(result.value.drivers[2]).toBeInstanceOf(driver3.constructor)
    }
  })

  it('should return error with translated message if no drivers are registered', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Driver not found.')

    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DriverNotFoundError)
    if (result.value instanceof DriverNotFoundError) {
      expect(result.value.message).toBe('Driver not found.')
    }
  })
})

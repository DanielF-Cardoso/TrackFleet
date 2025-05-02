import { describe, it, expect, beforeEach, vi } from 'vitest'

import { CreateDriverService } from './create-driver.service'
import { FakeHashGenerator } from 'test/cryptography/fake-hasher'

import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'
import { makeDriverInput } from 'test/factories/driver/make-driver-input'
import { DriverAlreadyExistsError } from './errors/driver-already-exists'

let sut: CreateDriverService
let driverRepository: InMemoryDriverRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  driverRepository = new InMemoryDriverRepository()
  const hasher = new FakeHashGenerator()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new CreateDriverService(driverRepository, hasher, i18n, logger)
})

describe('CreateDriverService', () => {
  it('should be able to create a new driver', async () => {
    const cnh = '62050501904'
    const createDriverData = makeDriverInput({ cnh })

    const result = await sut.execute(createDriverData)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const driver = result.value.driver

      expect(driver.name.getFirstName()).toBe(createDriverData.firstName)
      expect(driver.name.getLastName()).toBe(createDriverData.lastName)
      expect(driver.email.toValue()).toBe(createDriverData.email.toLowerCase())
    }
  })

  it('should not allow creating a driver with the same email', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A driver with this email already exists.',
    )

    const email = 'daniel@email.com'
    const createDriverData = makeDriverInput({ email })

    await sut.execute(createDriverData)

    const result = await sut.execute(createDriverData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DriverAlreadyExistsError)
    if (result.value instanceof DriverAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A driver with this email already exists.',
      )
    }
  })

  it('should not allow creating a driver with the same cnh', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A driver with this cnh already exists.',
    )

    const cnh = '62050501904'
    const createDriverData = makeDriverInput({ cnh })

    await sut.execute(createDriverData)

    const result = await sut.execute(createDriverData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DriverAlreadyExistsError)
    if (result.value instanceof DriverAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A driver with this cnh already exists.',
      )
    }
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'

import { CreateDriverService } from './create-driver.service'

import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'
import { makeDriverInput } from 'test/factories/driver/make-driver-input'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { CnhAlreadyExistsError } from './errors/cnh-already-exists.error'
import { PhoneAlreadyExistsError } from '@/domain/manager/application/services/errors/phone-already-exists.error'

let sut: CreateDriverService
let driverRepository: InMemoryDriverRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  driverRepository = new InMemoryDriverRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new CreateDriverService(driverRepository, i18n, logger)
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

    const email = 'same-email@email.com'
    const createDriverData = makeDriverInput({
      email,
      cnh: '54570596266',
    })

    await sut.execute(createDriverData)

    const result = await sut.execute(
      makeDriverInput({
        email,
        cnh: '83788755771',
      }),
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
    if (result.value instanceof EmailAlreadyExistsError) {
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
    const createDriverData = makeDriverInput({
      cnh,
    })

    await sut.execute(createDriverData)

    const result = await sut.execute(
      makeDriverInput({
        cnh,
      }),
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CnhAlreadyExistsError)
    if (result.value instanceof CnhAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A driver with this cnh already exists.',
      )
    }
  })

  it('should not allow creating a driver with the same phone', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A driver with this phone already exists.',
    )

    const phone = '11999999999'
    const createDriverData = makeDriverInput({
      phone,
      cnh: '12110666603',
    })

    await sut.execute(createDriverData)

    const result = await sut.execute(
      makeDriverInput({
        phone,
        cnh: '85854212027',
      }),
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PhoneAlreadyExistsError)
    if (result.value instanceof PhoneAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A driver with this phone already exists.',
      )
    }
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateDriverProfileService } from './update-driver-profile.service'
import { InMemoryDriverRepository } from 'test/repositories/in-memory-driver.repository'
import { makeDriver } from 'test/factories/driver/make-driver'
import { Email } from '@/core/value-objects/email.vo'
import { SameEmailError } from '../../../../core/errors/same-email.error'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { Phone } from '@/core/value-objects/phone.vo'
import { SamePhoneError } from '../../../../core/errors/same-phone.error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DriverAlreadyExistsError } from './errors/driver-already-exists.error'

let sut: UpdateDriverProfileService
let driverRepository: InMemoryDriverRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  driverRepository = new InMemoryDriverRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new UpdateDriverProfileService(driverRepository, i18n, logger)
})

describe('UpdateDriverProfileService', () => {
  it('should update driver profile', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)

    const result = await sut.execute({
      driverId: driver.id.toString(),
      firstName: 'Updated',
      lastName: 'Name',
      email: 'new@email.com',
      phone: '11912345678',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(driver.name.getFullName()).toBe('Updated Name')
      expect(driver.email.toValue()).toBe('new@email.com')
      expect(driver.phone.toValue()).toBe('11912345678')
    }
  })

  it('should update driver address', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)

    const result = await sut.execute({
      driverId: driver.id.toString(),
      street: 'New Street',
      number: 123,
      district: 'New District',
      zipCode: '12345678',
      city: 'New City',
      state: 'NS',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const newAddress = driver.address
      expect(newAddress.getStreet()).toBe('New Street')
      expect(newAddress.getNumber()).toBe(123)
      expect(newAddress.getDistrict()).toBe('New District')
      expect(newAddress.getZipCode()).toBe('12345678')
      expect(newAddress.getCity()).toBe('New City')
      expect(newAddress.getState()).toBe('NS')
    }
  })

  it('should not update address if any field is missing', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)

    const originalAddress = driver.address

    const result = await sut.execute({
      driverId: driver.id.toString(),
      street: 'New Street',
      number: 123,
      district: 'New District',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(driver.address).toBe(originalAddress)
    }
  })

  it('should clean and format CEP when updating address', async () => {
    const driver = makeDriver()
    await driverRepository.create(driver)

    const result = await sut.execute({
      driverId: driver.id.toString(),
      street: 'New Street',
      number: 123,
      district: 'New District',
      zipCode: '12345-678',
      city: 'New City',
      state: 'NS',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(driver.address.getZipCode()).toBe('12345678')
    }
  })

  it('should not update if driver does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Driver not found.')

    const result = await sut.execute({
      driverId: 'non-existent-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Driver not found.')
    }
  })

  it('should not update email if new email is the same as current', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'The new email cannot be the same as the current email.',
    )

    const driver = makeDriver({ email: new Email('taken@email.com') })
    await driverRepository.create(driver)

    const result = await sut.execute({
      driverId: driver.id.toString(),
      firstName: 'Another',
      lastName: 'Name',
      email: 'taken@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SameEmailError)
    if (result.value instanceof SameEmailError) {
      expect(result.value.message).toBe(
        'The new email cannot be the same as the current email.',
      )
    }
  })

  it('should not update phone if new phone is the same as current', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'The new phone cannot be the same as the current phone.',
    )

    const driver = makeDriver({ phone: new Phone('11912345678') })
    await driverRepository.create(driver)

    const result = await sut.execute({
      driverId: driver.id.toString(),
      firstName: 'Another',
      lastName: 'Name',
      phone: '11912345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SamePhoneError)
    if (result.value instanceof SamePhoneError) {
      expect(result.value.message).toBe(
        'The new phone cannot be the same as the current phone.',
      )
    }
  })

  it('should not allow changing email to one already in use', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A driver with this email already exists.',
    )

    const driver1 = makeDriver({ email: new Email('taken@email.com') })
    const driver2 = makeDriver({ email: new Email('available@email.com') })

    await driverRepository.create(driver1)
    await driverRepository.create(driver2)

    const result = await sut.execute({
      driverId: driver2.id.toString(),
      firstName: 'Another',
      lastName: 'Name',
      email: 'taken@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DriverAlreadyExistsError)
    if (result.value instanceof DriverAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A driver with this email already exists.',
      )
    }
  })

  it('should not allow changing phone to one already in use', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A driver with this phone already exists.',
    )

    const driver1 = makeDriver({ phone: new Phone('11912345678') })
    const driver2 = makeDriver({ phone: new Phone('11998765432') })

    await driverRepository.create(driver1)
    await driverRepository.create(driver2)

    const result = await sut.execute({
      driverId: driver2.id.toString(),
      firstName: 'Another',
      lastName: 'Name',
      phone: '11912345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DriverAlreadyExistsError)
    if (result.value instanceof DriverAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A driver with this phone already exists.',
      )
    }
  })
})

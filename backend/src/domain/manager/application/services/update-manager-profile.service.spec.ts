import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateManagerProfileService } from './update-manager-profile.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { Email } from '@/core/value-objects/email.vo'
import { SameEmailError } from '@/core/errors/same-email.error'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { Phone } from '@/core/value-objects/phone.vo'
import { SamePhoneError } from '@/core/errors/same-phone.error'
import { EmailAlreadyExistsError } from '../../../../core/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists.error'

let sut: UpdateManagerProfileService
let managerRepository: InMemoryManagerRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new UpdateManagerProfileService(managerRepository, i18n, logger)
})

describe('UpdateManagerProfileService', () => {
  it('should update manager profile', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      firstName: 'Updated',
      lastName: 'Name',
      email: 'new@email.com',
      phone: '11912345678',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(manager.name.getFullName()).toBe('Updated Name')
      expect(manager.email.toValue()).toBe('new@email.com')
      expect(manager.phone.toValue()).toBe('11912345678')
    }
  })

  it('should update manager address', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      street: 'New Street',
      number: 123,
      district: 'New District',
      zipCode: '12345678',
      city: 'New City',
      state: 'NS',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const newAddress = manager.address
      expect(newAddress.getStreet()).toBe('New Street')
      expect(newAddress.getNumber()).toBe(123)
      expect(newAddress.getDistrict()).toBe('New District')
      expect(newAddress.getZipCode()).toBe('12345678')
      expect(newAddress.getCity()).toBe('New City')
      expect(newAddress.getState()).toBe('NS')
    }
  })

  it('should not update address if any field is missing', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const originalAddress = manager.address

    const result = await sut.execute({
      managerId: manager.id.toString(),
      street: 'New Street',
      number: 123,
      district: 'New District',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(manager.address).toBe(originalAddress)
    }
  })

  it('should clean and format CEP when updating address', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      street: 'New Street',
      number: 123,
      district: 'New District',
      zipCode: '12345-678',
      city: 'New City',
      state: 'NS',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(manager.address.getZipCode()).toBe('12345678')
    }
  })

  it('should not update if manager does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Manager not found.')

    const result = await sut.execute({
      managerId: 'non-existent-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Manager not found.')
    }
  })

  it('should not update email if new email is the same as current', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'The new email cannot be the same as the current email.',
    )

    const manager = makeManager({ email: new Email('taken@email.com') })
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
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

    const manager = makeManager({ phone: new Phone('11912345678') })
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
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
      'A manager with this email already exists.',
    )

    const manager1 = makeManager({ email: new Email('taken@email.com') })
    const manager2 = makeManager({ email: new Email('available@email.com') })

    await managerRepository.create(manager1)
    await managerRepository.create(manager2)

    const result = await sut.execute({
      managerId: manager2.id.toString(),
      firstName: 'Another',
      lastName: 'Name',
      email: 'taken@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
    if (result.value instanceof EmailAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A manager with this email already exists.',
      )
    }
  })

  it('should not allow changing phone to one already in use', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A manager with this phone already exists.',
    )

    const manager1 = makeManager({ phone: new Phone('11912345678') })
    const manager2 = makeManager({ phone: new Phone('11998765432') })

    await managerRepository.create(manager1)
    await managerRepository.create(manager2)

    const result = await sut.execute({
      managerId: manager2.id.toString(),
      firstName: 'Another',
      lastName: 'Name',
      phone: '11912345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PhoneAlreadyExistsError)
    if (result.value instanceof PhoneAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A manager with this phone already exists.',
      )
    }
  })
})

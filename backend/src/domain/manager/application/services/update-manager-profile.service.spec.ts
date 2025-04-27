import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateManagerProfileService } from './update-manager-profile.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ManagerAlreadyExistsError } from './errors/manager-already-exists.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { Email } from '@/core/value-objects/email.vo'
import { SameEmailError } from './errors/same-email'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'

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
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(manager.name.getFullName()).toBe('Updated Name')
      expect(manager.email.toValue()).toBe('new@email.com')
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
    expect(result.value).toBeInstanceOf(ManagerAlreadyExistsError)
    if (result.value instanceof ManagerAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A manager with this email already exists.',
      )
    }
  })
})

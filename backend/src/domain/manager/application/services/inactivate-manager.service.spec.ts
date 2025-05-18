import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InactivateManagerService } from './inactivate-manager.service'
import { LastManagerCannotBeInactivatedError } from './errors/last-manager-cannot-be-inactivated.error'
import { OwnAccountCannotBeInactivatedError } from './errors/own-account-cannot-be-inactivated.error'

let sut: InactivateManagerService
let managerRepository: InMemoryManagerRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new InactivateManagerService(managerRepository, i18n, logger)
})

describe('InactivateManagerService', () => {
  it('should be able to inactivate a manager', async () => {
    const manager1 = makeManager()
    const manager2 = makeManager()

    await managerRepository.create(manager1)
    await managerRepository.create(manager2)

    const result = await sut.execute({
      managerId: manager1.id.toString(),
      currentManagerId: manager2.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(manager1.isActive).toBe(false)
    expect(manager1.inactiveAt).toBeInstanceOf(Date)
  })

  it('should not be able to inactivate a manager that does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Manager not found.')

    const result = await sut.execute({
      managerId: 'non-existing-manager-id',
      currentManagerId: 'some-other-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Manager not found.')
    }
  })

  it('should not be able to inactivate the last manager', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Cannot inactivate the last manager.',
    )

    const result = await sut.execute({
      managerId: manager.id.toString(),
      currentManagerId: 'some-other-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(LastManagerCannotBeInactivatedError)
    if (result.value instanceof LastManagerCannotBeInactivatedError) {
      expect(result.value.message).toBe('Cannot inactivate the last manager.')
    }
    expect(manager.isActive).toBe(true)
  })

  it('should not be able to inactivate own account', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Cannot inactivate your own account.',
    )

    const result = await sut.execute({
      managerId: manager.id.toString(),
      currentManagerId: manager.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OwnAccountCannotBeInactivatedError)
    if (result.value instanceof OwnAccountCannotBeInactivatedError) {
      expect(result.value.message).toBe('Cannot inactivate your own account.')
    }
    expect(manager.isActive).toBe(true)
  })
})

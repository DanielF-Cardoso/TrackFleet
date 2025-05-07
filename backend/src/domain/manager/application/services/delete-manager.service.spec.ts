import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteManagerService } from './delete-manager.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { CannotDeleteLastManagerError } from './errors/cannot-delete-last-maanger.error'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'

let sut: DeleteManagerService
let managerRepository: InMemoryManagerRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new DeleteManagerService(managerRepository, i18n, logger)
})

describe('DeleteManagerService', () => {
  it('should be able to delete a manager', async () => {
    const manager1 = makeManager()
    const manager2 = makeManager()

    await managerRepository.create(manager1)
    await managerRepository.create(manager2)

    const result = await sut.execute({ managerId: manager1.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(managerRepository.items).toHaveLength(1)
  })

  it('should not be able to delete a manager that does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Manager not found.')

    const result = await sut.execute({ managerId: 'non-existing-manager-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Manager not found.')
    }
  })

  it('should not be able to delete the last manager', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Cannot delete the last manager.',
    )

    const result = await sut.execute({ managerId: manager.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CannotDeleteLastManagerError)
    if (result.value instanceof CannotDeleteLastManagerError) {
      expect(result.value.message).toBe('Cannot delete the last manager.')
    }
    expect(managerRepository.items).toHaveLength(1)
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ListManagersService } from './list-managers.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'

let sut: ListManagersService
let managerRepository: InMemoryManagerRepository
let i18n: I18nService

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  sut = new ListManagersService(managerRepository, i18n)
})

describe('ListManagersService', () => {
  it('should return a list of all managers', async () => {
    const manager1 = makeManager()
    const manager2 = makeManager()
    const manager3 = makeManager()

    await managerRepository.create(manager1)
    await managerRepository.create(manager2)
    await managerRepository.create(manager3)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.managers).toHaveLength(3)
      expect(result.value.managers[0]).toBeInstanceOf(manager1.constructor)
      expect(result.value.managers[1]).toBeInstanceOf(manager2.constructor)
      expect(result.value.managers[2]).toBeInstanceOf(manager3.constructor)
    }
  })

  it('should return error with translated message if no managers are registered', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Manager not found.')

    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Manager not found.')
    }
  })
})

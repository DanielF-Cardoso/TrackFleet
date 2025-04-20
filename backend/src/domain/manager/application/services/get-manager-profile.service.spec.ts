import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetManagerProfileService } from './get-manager-profile.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'

let sut: GetManagerProfileService
let managerRepository: InMemoryManagerRepository
let i18n: I18nService

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  sut = new GetManagerProfileService(managerRepository, i18n)
})

describe('GetManagerProfileService', () => {
  it('should return manager profile by id', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const result = await sut.execute({ managerId: manager.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.manager.id.toString()).toBe(manager.id.toString())
      expect(result.value.manager.name.getFirstName()).toBe(
        manager.name.getFirstName(),
      )
    }
  })

  it('should return error with translated message if manager is not found', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Manager not found.')

    const result = await sut.execute({ managerId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Manager not found.')
    }
  })
})

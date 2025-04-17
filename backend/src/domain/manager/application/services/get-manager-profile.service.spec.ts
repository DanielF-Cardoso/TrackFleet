import { GetManagerProfileService } from './get-manager-profile.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

let sut: GetManagerProfileService
let managerRepository: InMemoryManagerRepository

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  sut = new GetManagerProfileService(managerRepository)
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

  it('should not return manager if not found', async () => {
    const result = await sut.execute({ managerId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

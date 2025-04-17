import { ListManagersService } from './list-managers.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

let sut: ListManagersService
let managerRepository: InMemoryManagerRepository

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  sut = new ListManagersService(managerRepository)
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

  it('should not return managers list if no managers are registered', async () => {
    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

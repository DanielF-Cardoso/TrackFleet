import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { CreateManagerService } from './create-manager.service'
import { FakeHashGenerator } from 'test/cryptography/fake-hasher'
import { makeManager } from 'test/factories/manager/make-manager'
import { ManagerAlreadyExistsError } from './errors/manager-already-exists.error'

let sut: CreateManagerService
let managerRepository: InMemoryManagerRepository

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  const hasher = new FakeHashGenerator()
  sut = new CreateManagerService(managerRepository, hasher)
})

describe('CreateManagerUseCase', () => {
  it('should be able to create a new manager', async () => {
    const createManagerData = makeManager()

    const result = await sut.execute(createManagerData)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const manager = result.value.manager

      expect(manager.name.getFirstName()).toBe(createManagerData.firstName)
      expect(manager.name.getLastName()).toBe(createManagerData.lastName)
      expect(manager.email.toValue()).toBe(
        createManagerData.email.toLowerCase(),
      )
      expect(manager.password).toBe(`hashed-${createManagerData.password}`)
    }
  })

  it('should not allow creating a manager with the same email', async () => {
    const email = 'daniel@email.com'
    const createManagerData = makeManager({ email })

    await sut.execute(createManagerData)

    const result = await sut.execute(createManagerData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ManagerAlreadyExistsError)
  })
})

import { UpdateManagerProfileService } from './update-manager-profile.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { ManagerAlreadyExistsError } from './errors/manager-already-exists.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { Email } from '@/core/value-objects/email.vo'
import { SameEmailError } from './errors/same-email'

let sut: UpdateManagerProfileService
let managerRepository: InMemoryManagerRepository

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  sut = new UpdateManagerProfileService(managerRepository)
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
    expect(manager.name.getFullName()).toBe('Updated Name')
    expect(manager.email.toValue()).toBe('new@email.com')
  })

  it('should not update if manager does not exist', async () => {
    const result = await sut.execute({
      managerId: 'non-existent-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not update email if new email is the same as current', async () => {
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
  })

  it('should not allow changing email to one already in use', async () => {
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
  })
})

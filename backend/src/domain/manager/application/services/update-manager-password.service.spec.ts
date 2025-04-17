import { UpdateManagerPasswordService } from './update-manager-password.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { FakeHashGenerator } from 'test/cryptography/fake-hasher'
import { FakeHashComparer } from 'test/cryptography/fake-hasher-compare'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { SamePasswordError } from './errors/same-password'

let sut: UpdateManagerPasswordService
let managerRepository: InMemoryManagerRepository

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  const hasher = new FakeHashGenerator()
  const hashComparer = new FakeHashComparer()

  sut = new UpdateManagerPasswordService(
    managerRepository,
    hashComparer,
    hasher,
  )
})

describe('UpdateManagerPasswordService', () => {
  it('should update password with correct current password', async () => {
    const manager = makeManager({ password: 'hashed-oldpass' })
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
    })

    expect(result.isRight()).toBe(true)
    expect(manager.password).toBe('hashed-newpass123')
  })

  it('should not update password if manager does not exist', async () => {
    const result = await sut.execute({
      managerId: '1',
      currentPassword: 'any-pass',
      newPassword: 'newpass123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not update password if new password is the same as current', async () => {
    const manager = makeManager({ password: 'hashed-oldpass' })
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      currentPassword: 'oldpass',
      newPassword: 'oldpass',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SamePasswordError)
    expect(manager.password).toBe('hashed-oldpass')
  })

  it('should not update password if current is invalid', async () => {
    const manager = makeManager({ password: 'hashed-oldpass' })
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      currentPassword: 'wrongpass',
      newPassword: 'newpass123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})

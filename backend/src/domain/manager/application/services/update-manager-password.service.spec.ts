import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateManagerPasswordService } from './update-manager-password.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { FakeHashGenerator } from 'test/cryptography/fake-hasher'
import { FakeHashComparer } from 'test/cryptography/fake-hasher-compare'
import { SamePasswordError } from './errors/same-password.error'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { InvalidPasswordError } from './errors/invalid-password.error'
import { FakeLogger } from 'test/fake/logs-mocks'

let sut: UpdateManagerPasswordService
let managerRepository: InMemoryManagerRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  const hasher = new FakeHashGenerator()
  const hashComparer = new FakeHashComparer()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new UpdateManagerPasswordService(
    managerRepository,
    hashComparer,
    hasher,
    i18n,
    logger,
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
    vi.spyOn(i18n, 'translate').mockResolvedValue('Manager not found.')

    const result = await sut.execute({
      managerId: '1',
      currentPassword: 'any-pass',
      newPassword: 'newpass123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Manager not found.')
    }
  })

  it('should not update password if new password is the same as current', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'The new password cannot be the same as the current password.',
    )

    const manager = makeManager({ password: 'hashed-oldpass' })
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      currentPassword: 'oldpass',
      newPassword: 'oldpass',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SamePasswordError)
    if (result.value instanceof SamePasswordError) {
      expect(result.value.message).toBe(
        'The new password cannot be the same as the current password.',
      )
    }
    expect(manager.password).toBe('hashed-oldpass')
  })

  it('should not update password if current password is invalid', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Invalid current password.')

    const manager = makeManager({ password: 'hashed-oldpass' })
    await managerRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      currentPassword: 'wrongpass',
      newPassword: 'newpass123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
    if (result.value instanceof InvalidPasswordError) {
      expect(result.value.message).toBe('Invalid current password.')
    }
  })
})

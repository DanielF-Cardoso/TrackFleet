import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { InMemoryManagerPasswordResetTokenRepository } from 'test/repositories/in-memory-manager-password-reset-token.repository'
import { ResetManagerPasswordService } from './reset-manager-password.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { makeManager } from 'test/factories/manager/make-manager'
import { FakeHashGenerator } from 'test/cryptography/fake-hasher'
import { PasswordResetToken } from '../../enterprise/entities/password-reset-token.entity'
import { InvalidTokenError } from './errors/invalid-token.error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let sut: ResetManagerPasswordService
let managerRepository: InMemoryManagerRepository
let passwordResetTokenRepository: InMemoryManagerPasswordResetTokenRepository
let i18n: any
let logger: FakeLogger
let hashGenerator: FakeHashGenerator

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  passwordResetTokenRepository =
    new InMemoryManagerPasswordResetTokenRepository()
  hashGenerator = new FakeHashGenerator()

  i18n = {
    translate: vi.fn(),
  }

  logger = new FakeLogger()

  sut = new ResetManagerPasswordService(
    managerRepository,
    passwordResetTokenRepository,
    hashGenerator,
    i18n,
    logger,
  )
})

describe('ResetManagerPasswordService', () => {
  it('should be able to reset a manager password with a valid token', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const token = PasswordResetToken.create({
      token: 'valid-token',
      managerId: manager.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    })

    await passwordResetTokenRepository.create(token)

    vi.spyOn(i18n, 'translate').mockResolvedValue('Invalid token')

    const result = await sut.execute({
      token: 'valid-token',
      password: 'new-password',
    })

    expect(result.isRight()).toBe(true)
    expect(manager.password).toBe('hashed-new-password')
    expect(token.isUsed).toBe(true)
  })

  it('should not be able to reset password with an invalid token', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Invalid token')

    const result = await sut.execute({
      token: 'invalid-token',
      password: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTokenError)
    if (result.value instanceof InvalidTokenError) {
      expect(result.value.message).toBe('Invalid token')
    }
  })

  it('should not be able to reset password with an expired token', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const token = PasswordResetToken.create({
      token: 'expired-token',
      managerId: manager.id,
      expiresAt: new Date(Date.now() - 1000), // 1 second ago
    })

    await passwordResetTokenRepository.create(token)

    vi.spyOn(i18n, 'translate').mockResolvedValue('Invalid token')

    const result = await sut.execute({
      token: 'expired-token',
      password: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTokenError)
    if (result.value instanceof InvalidTokenError) {
      expect(result.value.message).toBe('Invalid token')
    }
  })

  it('should not be able to reset password with an already used token', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const token = PasswordResetToken.create({
      token: 'used-token',
      managerId: manager.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    })

    token.markAsUsed()
    await passwordResetTokenRepository.create(token)

    vi.spyOn(i18n, 'translate').mockResolvedValue('Invalid token')

    const result = await sut.execute({
      token: 'used-token',
      password: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTokenError)
    if (result.value instanceof InvalidTokenError) {
      expect(result.value.message).toBe('Invalid token')
    }
  })

  it('should not be able to reset password if manager does not exist', async () => {
    const token = PasswordResetToken.create({
      token: 'valid-token',
      managerId: new UniqueEntityID(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    })

    await passwordResetTokenRepository.create(token)

    vi.spyOn(i18n, 'translate').mockResolvedValue('Invalid token')

    const result = await sut.execute({
      token: 'valid-token',
      password: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTokenError)
    if (result.value instanceof InvalidTokenError) {
      expect(result.value.message).toBe('Invalid token')
    }
  })
})

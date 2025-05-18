import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { SendForgotPasswordEmailService } from './send-forgot-password-email.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { makeManager } from 'test/factories/manager/make-manager'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { TokenRequestTooSoonError } from './errors/token-request-too-soon.error'
import { PasswordResetToken } from '../../enterprise/entities/password-reset-token.entity'
import { InMemoryManagerPasswordResetTokenRepository } from 'test/repositories/in-memory-manager-password-reset-token.repository'

let sut: SendForgotPasswordEmailService
let managerRepository: InMemoryManagerRepository
let passwordResetTokenRepository: InMemoryManagerPasswordResetTokenRepository
let i18n: any
let logger: FakeLogger
let mailerService: any
let configService: any

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  passwordResetTokenRepository =
    new InMemoryManagerPasswordResetTokenRepository()

  i18n = {
    translate: vi.fn(),
  }

  logger = new FakeLogger()

  mailerService = {
    sendMail: vi.fn(),
  }

  configService = {
    get: vi.fn().mockReturnValue('http://localhost:3000'),
  }

  sut = new SendForgotPasswordEmailService(
    managerRepository,
    passwordResetTokenRepository,
    mailerService,
    i18n,
    configService,
    logger,
  )
})

describe('SendForgotPasswordEmailService', () => {
  it('should be able to send a forgot password email', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    vi.spyOn(i18n, 'translate').mockResolvedValue('Password Reset')

    const result = await sut.execute({
      email: manager.email.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: manager.email.toValue(),
        subject: 'Password Reset',
        template: 'forgot-password',
        context: expect.objectContaining({
          name: manager.name.toValue(),
          resetLink: expect.stringContaining(
            'http://localhost:3000/reset-password?token=',
          ),
          currentYear: expect.any(Number),
        }),
      }),
    )
  })

  it('should not be able to send a forgot password email to a non-existent manager', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Manager not found')

    const result = await sut.execute({
      email: 'nonexistent@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('Manager not found')
    }
  })

  it('should not be able to send a forgot password email if a token was requested less than 1 minute ago', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const token = PasswordResetToken.create({
      token: 'old-token',
      managerId: manager.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      createdAt: new Date(), // Now
    })

    await passwordResetTokenRepository.create(token)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'Please wait before requesting a new token',
    )

    const result = await sut.execute({
      email: manager.email.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TokenRequestTooSoonError)
    if (result.value instanceof TokenRequestTooSoonError) {
      expect(result.value.message).toBe(
        'Please wait before requesting a new token',
      )
    }
  })

  it('should be able to send a forgot password email if the last token was requested more than 1 minute ago', async () => {
    const manager = makeManager()
    await managerRepository.create(manager)

    const oldToken = PasswordResetToken.create({
      token: 'old-token',
      managerId: manager.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    })

    await passwordResetTokenRepository.create(oldToken)

    vi.spyOn(i18n, 'translate').mockResolvedValue('Password Reset')

    const result = await sut.execute({
      email: manager.email.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(mailerService.sendMail).toHaveBeenCalled()
  })
})

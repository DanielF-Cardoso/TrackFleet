import { Injectable, LoggerService, Inject } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { Either, left, right } from '@/core/errors/either'
import { ManagerRepository } from '../repositories/manager-repository'
import { ManagerPasswordResetTokenRepository } from '../repositories/manager-password-reset-token-repository'
import { PasswordResetToken } from '../../enterprise/entities/password-reset-token.entity'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { TokenRequestTooSoonError } from './errors/token-request-too-soon.error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { PasswordResetTokenCreatedEvent } from '../../enterprise/events/password-reset-token-created.event'

export interface SendForgotPasswordEmailServiceRequest {
  email: string
}

type SendForgotPasswordEmailServiceResponse = Either<
  ResourceNotFoundError | TokenRequestTooSoonError,
  null
>

@Injectable()
export class SendForgotPasswordEmailService {
  constructor(
    private managerRepository: ManagerRepository,
    private passwordResetTokenRepository: ManagerPasswordResetTokenRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    email,
  }: SendForgotPasswordEmailServiceRequest): Promise<SendForgotPasswordEmailServiceResponse> {
    this.logger.log(
      `Starting password reset process for email: ${email}`,
      'SendForgotPasswordEmailService',
    )

    const manager = await this.managerRepository.findByEmail(email)

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      this.logger.warn(
        `Manager not found with email: ${email}`,
        'SendForgotPasswordEmailService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    const recentToken = await this.passwordResetTokenRepository.findByManagerId(
      manager.id,
    )

    if (recentToken) {
      const timeSinceLastToken = Date.now() - recentToken.createdAt.getTime()
      const oneMinuteInMs = 60 * 1000 // 1 minute in milliseconds

      if (timeSinceLastToken < oneMinuteInMs) {
        const errorMessage = await this.i18n.translate(
          'errors.auth.tokenRequestTooSoon',
        )
        this.logger.warn(
          `Token requested too soon for email: ${email}`,
          'SendForgotPasswordEmailService',
        )
        return left(new TokenRequestTooSoonError(errorMessage))
      }
    }

    const rawToken = new UniqueEntityID().toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    const passwordResetToken = PasswordResetToken.create({
      token: rawToken,
      managerId: manager.id,
      expiresAt,
    })

    await this.passwordResetTokenRepository.create(passwordResetToken)

    DomainEvents.markEventForDispatch(
      new PasswordResetTokenCreatedEvent(manager, rawToken),
    )

    this.logger.log(
      `Password reset token created successfully for: ${email}`,
      'SendForgotPasswordEmailService',
    )

    return right(null)
  }
}

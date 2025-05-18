import { Injectable, LoggerService, Inject } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { Either, left, right } from '@/core/errors/either'
import { ManagerRepository } from '../repositories/manager-repository'
import { ManagerPasswordResetTokenRepository } from '../repositories/manager-password-reset-token-repository'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { InvalidTokenError } from './errors/invalid-token.error'

export interface ResetManagerPasswordServiceRequest {
  token: string
  password: string
}

type ResetManagerPasswordServiceResponse = Either<InvalidTokenError, null>

@Injectable()
export class ResetManagerPasswordService {
  constructor(
    private managerRepository: ManagerRepository,
    private passwordResetTokenRepository: ManagerPasswordResetTokenRepository,
    private hashGenerator: HashGenerator,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    token,
    password,
  }: ResetManagerPasswordServiceRequest): Promise<ResetManagerPasswordServiceResponse> {
    this.logger.log(
      `Starting password reset process for token: ${token}`,
      'ResetManagerPasswordService',
    )

    const resetToken =
      await this.passwordResetTokenRepository.findByToken(token)

    if (!resetToken) {
      const errorMessage = await this.i18n.translate('errors.auth.invalidToken')
      this.logger.warn(
        `Invalid or expired token: ${token}`,
        'ResetManagerPasswordService',
      )
      return left(new InvalidTokenError(errorMessage))
    }

    if (resetToken.isUsed) {
      const errorMessage = await this.i18n.translate('errors.auth.invalidToken')
      this.logger.warn(
        `Token already used: ${token}`,
        'ResetManagerPasswordService',
      )
      return left(new InvalidTokenError(errorMessage))
    }

    if (resetToken.isExpired) {
      const errorMessage = await this.i18n.translate('errors.auth.invalidToken')
      this.logger.warn(`Token expired: ${token}`, 'ResetManagerPasswordService')
      return left(new InvalidTokenError(errorMessage))
    }

    const manager = await this.managerRepository.findById(
      resetToken.managerId.toString(),
    )

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.auth.invalidToken')
      this.logger.warn(
        `Manager not found for token: ${token}`,
        'ResetManagerPasswordService',
      )
      return left(new InvalidTokenError(errorMessage))
    }

    const hashedPassword = await this.hashGenerator.generateHash(password)

    manager.updatePassword(hashedPassword)
    resetToken.markAsUsed()

    await this.managerRepository.save(manager)
    await this.passwordResetTokenRepository.save(resetToken)

    this.logger.log(
      `Password reset successfully for manager: ${manager.id.toString()}`,
      'ResetManagerPasswordService',
    )

    return right(null)
  }
}

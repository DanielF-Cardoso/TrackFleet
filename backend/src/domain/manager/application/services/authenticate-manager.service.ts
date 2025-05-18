import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { Encrypter } from '@/core/cryptography/encrypter'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { InactiveManagerError } from './errors/inactive-manager.error'

interface AuthenticateManagerRequest {
  email: string
  password: string
}

type AuthenticateManagerResponse = Either<
  InvalidCredentialsError | InactiveManagerError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateManagerService {
  constructor(
    private managerRepository: ManagerRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateManagerRequest): Promise<AuthenticateManagerResponse> {
    this.logger.log(
      `Authenticating manager with email: ${email}`,
      'AuthenticateManagerService',
    )

    const manager = await this.managerRepository.findByEmail(email)

    if (!manager) {
      const errorMessage = await this.i18n.translate(
        'errors.auth.invalidCredentials',
      )
      this.logger.warn(
        `Authentication failed: Manager not found for email: ${email}`,
        'AuthenticateManagerService',
      )
      return left(new InvalidCredentialsError(errorMessage))
    }

    if (!manager.isActive) {
      const errorMessage = await this.i18n.translate('errors.auth.inactiveUser')
      this.logger.warn(
        `Authentication failed: Inactive manager for email: ${email}`,
        'AuthenticateManagerService',
      )
      return left(new InactiveManagerError(errorMessage))
    }

    const isValid = await this.hashComparer.compareHash(
      password,
      manager.password,
    )

    if (!isValid) {
      const errorMessage = await this.i18n.translate(
        'errors.auth.invalidCredentials',
      )
      this.logger.warn(
        `Authentication failed: Invalid password for email: ${email}`,
        'AuthenticateManagerService',
      )
      return left(new InvalidCredentialsError(errorMessage))
    }

    manager.updateLastLogin()
    await this.managerRepository.save(manager)

    const accessToken = await this.encrypter.encrypt({
      sub: manager.id.toString(),
    })

    this.logger.log(
      `Manager authenticated successfully: ${email}`,
      'AuthenticateManagerService',
    )

    return right({ accessToken })
  }
}

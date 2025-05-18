import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { LastManagerCannotBeInactivatedError } from './errors/last-manager-cannot-be-inactivated.error'
import { OwnAccountCannotBeInactivatedError } from './errors/own-account-cannot-be-inactivated.error'

interface InactivateManagerRequest {
  managerId: string
  currentManagerId: string
}

type InactivateManagerResponse = Either<
  | ResourceNotFoundError
  | LastManagerCannotBeInactivatedError
  | OwnAccountCannotBeInactivatedError,
  null
>

@Injectable()
export class InactivateManagerService {
  constructor(
    private managerRepository: ManagerRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    managerId,
    currentManagerId,
  }: InactivateManagerRequest): Promise<InactivateManagerResponse> {
    this.logger.log(
      `Fetching manager for inactivation, with id: ${managerId}`,
      'InactivateManagerService',
    )

    if (managerId === currentManagerId) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.cannotInactivateOwn',
      )
      this.logger.warn(
        `Attempted to inactivate own account: managerId: ${managerId}`,
        'InactivateManagerService',
      )
      return left(new OwnAccountCannotBeInactivatedError(errorMessage))
    }

    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      this.logger.warn(
        `Manager not found for managerId: ${managerId}`,
        'InactivateManagerService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    const allManagers = await this.managerRepository.findAll()
    if (allManagers.length === 1) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.cannotInactivateLast',
      )
      this.logger.warn(
        `Attempted to inactivate the last manager with id: ${managerId}`,
        'InactivateManagerService',
      )
      return left(new LastManagerCannotBeInactivatedError(errorMessage))
    }

    manager.inactivate()
    await this.managerRepository.save(manager)

    this.logger.log(
      `Manager inactivated with id: ${managerId}`,
      'InactivateManagerService',
    )
    return right(null)
  }
}

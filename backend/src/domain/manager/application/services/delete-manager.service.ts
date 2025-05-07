import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { CannotDeleteLastManagerError } from './errors/cannot-delete-last-maanger.error'
import { CannotDeleteOwnAccountError } from './errors/cannot-delete-own-account.error'

interface DeleteManagerRequest {
  managerId: string
  currentManagerId: string
}

type DeleteManagerResponse = Either<
  | ResourceNotFoundError
  | CannotDeleteLastManagerError
  | CannotDeleteOwnAccountError,
  null
>

@Injectable()
export class DeleteManagerService {
  constructor(
    private managerRepository: ManagerRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    managerId,
    currentManagerId,
  }: DeleteManagerRequest): Promise<DeleteManagerResponse> {
    this.logger.log(
      `Fetching manager for remove, with id: ${managerId}`,
      'DeleteManagerService',
    )

    if (managerId === currentManagerId) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.cannotDeleteOwn',
      )
      this.logger.warn(
        `Attempted to delete own account: managerId: ${managerId}`,
        'DeleteManagerService',
      )
      return left(new CannotDeleteOwnAccountError(errorMessage))
    }

    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      this.logger.warn(
        `Manager not found for managerId: ${managerId}`,
        'DeleteManagerService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    const allManagers = await this.managerRepository.findAll()
    if (allManagers.length === 1) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.cannotDeleteLast',
      )
      this.logger.warn(
        `Attempted to delete the last manager with id: ${managerId}`,
        'DeleteManagerService',
      )
      return left(new CannotDeleteLastManagerError(errorMessage))
    }

    await this.managerRepository.delete(manager)

    this.logger.log(
      `Manager removed with id: ${managerId}`,
      'DeleteManagerService',
    )
    return right(null)
  }
}

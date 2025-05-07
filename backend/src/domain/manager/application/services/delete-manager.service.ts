import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Manager } from '../../enterprise/entities/manager.entity'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { CannotDeleteLastManagerError } from './errors/cannot-delete-last-maanger.error'

interface DeleteManagerRequest {
  managerId: string
}

type DeleteManagerResponse = Either<
  ResourceNotFoundError | CannotDeleteLastManagerError,
  {
    manager: Manager
  }
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
  }: DeleteManagerRequest): Promise<DeleteManagerResponse> {
    this.logger.log(
      `Fetching manager for remove, with id: ${managerId}`,
      'DeleteManagerService',
    )

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
    return right({ manager })
  }
}

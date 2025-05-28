import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { Manager } from '../../enterprise/entities/manager.entity'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

type ListManagersServiceResponse = Either<
  ResourceNotFoundError,
  { managers: Manager[] }
>

@Injectable()
export class ListManagersService {
  constructor(
    private managerRepository: ManagerRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) { }

  async execute(): Promise<ListManagersServiceResponse> {
    this.logger.log('Listing all managers', 'ListManagersService')

    const managers = await this.managerRepository.findAll()

    if (managers.length === 0) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.notFoundAll',
      )
      this.logger.warn('No managers found', 'ListManagersService')
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(
      `Found ${managers.length} manager(s)`,
      'ListManagersService',
    )
    return right({ managers })
  }
}

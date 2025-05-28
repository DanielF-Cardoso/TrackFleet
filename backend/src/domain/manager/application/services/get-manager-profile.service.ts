import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Manager } from '../../enterprise/entities/manager.entity'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

interface GetManagerProfileRequest {
  managerId: string
}

type GetManagerProfileResponse = Either<
  ResourceNotFoundError,
  {
    manager: Manager
  }
>

@Injectable()
export class GetManagerProfileService {
  constructor(
    private managerRepository: ManagerRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) { }

  async execute({
    managerId,
  }: GetManagerProfileRequest): Promise<GetManagerProfileResponse> {
    this.logger.log(
      `Fetching profile for managerId: ${managerId}`,
      'GetManagerProfileService',
    )

    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      this.logger.warn(
        `Manager profile not found for managerId: ${managerId}`,
        'GetManagerProfileService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(
      `Manager profile found for managerId: ${managerId}`,
      'GetManagerProfileService',
    )
    return right({ manager })
  }
}

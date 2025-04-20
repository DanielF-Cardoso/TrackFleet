import { Injectable } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Manager } from '../../enterprise/entities/manager.entity'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'

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
  ) {}

  async execute({
    managerId,
  }: GetManagerProfileRequest): Promise<GetManagerProfileResponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      return left(new ResourceNotFoundError(errorMessage))
    }

    return right({ manager })
  }
}

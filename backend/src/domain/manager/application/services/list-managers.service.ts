import { Injectable } from '@nestjs/common'
import { Manager } from '../../enterprise/entities/manager.entity'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'

type ListManagersServiceResponse = Either<
  ResourceNotFoundError,
  { managers: Manager[] }
>

@Injectable()
export class ListManagersService {
  constructor(
    private managerRepository: ManagerRepository,
    private i18n: I18nService,
  ) {}

  async execute(): Promise<ListManagersServiceResponse> {
    const managers = await this.managerRepository.findAll()

    if (managers.length === 0) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.notFoundAll',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    return right({ managers })
  }
}

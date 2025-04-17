import { Injectable } from '@nestjs/common'
import { Manager } from '../../enterprise/entities/manager.entity'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

type ListManagersServiceResponse = Either<
  ResourceNotFoundError,
  { managers: Manager[] }
>

@Injectable()
export class ListManagersService {
  constructor(private managerRepository: ManagerRepository) {}

  async execute(): Promise<ListManagersServiceResponse> {
    const managers = await this.managerRepository.findAll()

    if (managers.length === 0) {
      return left(new ResourceNotFoundError('Managers'))
    }

    return right({ managers })
  }
}

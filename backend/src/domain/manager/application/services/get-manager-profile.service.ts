import { Injectable } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Manager } from '../../enterprise/entities/manager.entity'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

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
  constructor(private managerRepository: ManagerRepository) {}

  async execute({
    managerId,
  }: GetManagerProfileRequest): Promise<GetManagerProfileResponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      return left(new ResourceNotFoundError('Manager'))
    }

    return right({ manager })
  }
}

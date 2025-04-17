import { Injectable } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Manager } from '../../enterprise/entities/manager.entity'
import { Either, left, right } from '@/core/errors/either'
import { ManagerNotFound } from './errors/manager-not-found.error'

interface GetManagerProfileRequest {
  managerId: string
}

type GetManagerProfileResponse = Either<
  ManagerNotFound,
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
      return left(new ManagerNotFound())
    }

    return right({ manager })
  }
}

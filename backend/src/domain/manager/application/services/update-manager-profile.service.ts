import { Injectable } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { ManagerAlreadyExistsError } from './errors/manager-already-exists.error'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { SameEmailError } from './errors/same-email'
import { Manager } from '../../enterprise/entities/manager.entity'

interface UpdateManagerProfileRequest {
  managerId: string
  firstName: string
  lastName: string
  email: string
}

type UpdateManagerProfileResponse = Either<
  ResourceNotFoundError | ManagerAlreadyExistsError | SameEmailError,
  { manager: Manager }
>

@Injectable()
export class UpdateManagerProfileService {
  constructor(private managerRepository: ManagerRepository) {}

  async execute({
    managerId,
    firstName,
    lastName,
    email,
  }: UpdateManagerProfileRequest): Promise<UpdateManagerProfileResponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      return left(new ResourceNotFoundError('Manager'))
    }

    const newEmail = new Email(email)

    if (manager.email.equals(newEmail)) {
      return left(new SameEmailError())
    }

    const existingWithSameEmail = await this.managerRepository.findByEmail(
      newEmail.toValue(),
    )

    if (existingWithSameEmail) {
      return left(new ManagerAlreadyExistsError())
    }

    manager.updateProfile({
      name: new Name(firstName, lastName),
      email: newEmail,
    })

    await this.managerRepository.save(manager)

    return right({ manager })
  }
}

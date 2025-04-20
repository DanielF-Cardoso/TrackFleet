import { Injectable } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { ManagerAlreadyExistsError } from './errors/manager-already-exists.error'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { SameEmailError } from './errors/same-email'
import { Manager } from '../../enterprise/entities/manager.entity'
import { I18nService } from 'nestjs-i18n'

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
  constructor(
    private managerRepository: ManagerRepository,
    private i18n: I18nService,
  ) {}

  async execute({
    managerId,
    firstName,
    lastName,
    email,
  }: UpdateManagerProfileRequest): Promise<UpdateManagerProfileResponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      return left(new ResourceNotFoundError(errorMessage))
    }

    let newEmail = manager.email
    if (email) {
      const emailValueObject = new Email(email)

      if (manager.email.equals(emailValueObject)) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.sameEmail',
        )
        return left(new SameEmailError(errorMessage))
      }

      const existingWithSameEmail = await this.managerRepository.findByEmail(
        emailValueObject.toValue(),
      )

      if (existingWithSameEmail) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.alreadyExists',
        )
        return left(new ManagerAlreadyExistsError(errorMessage))
      }

      newEmail = emailValueObject
    }

    const newFirstName = firstName || manager.name.getFirstName()
    const newLastName = lastName || manager.name.getLastName()

    manager.updateProfile({
      name: new Name(newFirstName, newLastName),
      email: newEmail,
    })

    await this.managerRepository.save(manager)

    return right({ manager })
  }
}

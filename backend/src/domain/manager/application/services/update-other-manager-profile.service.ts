import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { ManagerRepository } from '../repositories/manager-repository'
import { Email } from '@/core/value-objects/email.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Address } from '@/core/value-objects/address.vo'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { Manager } from '../../enterprise/entities/manager.entity'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists.error'
import { EmailAlreadyExistsError } from '../../../../core/errors/email-already-exists.error'

interface UpdateOtherManagerProfileRequest {
  managerId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  street?: string
  number?: number
  district?: string
  zipCode?: string
  city?: string
  state?: string
}

type UpdateOtherManagerProfileResponse = Either<
  ResourceNotFoundError | EmailAlreadyExistsError | PhoneAlreadyExistsError,
  { manager: Manager }
>

@Injectable()
export class UpdateOtherManagerProfileService {
  constructor(
    private managerRepository: ManagerRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    managerId,
    firstName,
    lastName,
    email,
    phone,
    street,
    number,
    district,
    zipCode,
    city,
    state,
  }: UpdateOtherManagerProfileRequest): Promise<UpdateOtherManagerProfileResponse> {
    this.logger.log(
      `Attempting to update another manager profile for managerId: ${managerId}`,
      'UpdateOtherManagerProfileService',
    )

    const manager = await this.managerRepository.findById(managerId)
    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      this.logger.warn(
        `Manager not found for profile update: managerId ${managerId}`,
        'UpdateOtherManagerProfileService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    let newEmail = manager.email
    if (email && email !== manager.email.toValue()) {
      const emailValueObject = new Email(email)
      const existingWithSameEmail = await this.managerRepository.findByEmail(
        emailValueObject.toValue(),
      )
      if (existingWithSameEmail && existingWithSameEmail.id !== manager.id) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.alreadyExists',
        )
        this.logger.warn(
          `Email ${email} already in use during profile update for managerId: ${managerId}`,
          'UpdateOtherManagerProfileService',
        )
        return left(new EmailAlreadyExistsError(errorMessage))
      }
      newEmail = emailValueObject
    }

    let newPhone = manager.phone
    if (phone && phone !== manager.phone.toValue()) {
      const phoneValueObject = new Phone(phone)
      const existingWithSamePhone = await this.managerRepository.findByPhone(
        phoneValueObject.toValue(),
      )
      if (existingWithSamePhone && existingWithSamePhone.id !== manager.id) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.alreadyExists',
        )
        this.logger.warn(
          `Phone ${phone} already in use during profile update for managerId: ${managerId}`,
          'UpdateOtherManagerProfileService',
        )
        return left(new PhoneAlreadyExistsError(errorMessage))
      }
      newPhone = phoneValueObject
    }

    const newFirstName = firstName || manager.name.getFirstName()
    const newLastName = lastName || manager.name.getLastName()
    let newAddress = manager.address
    if (street && number && district && zipCode && city && state) {
      newAddress = new Address(street, number, district, zipCode, city, state)
    }

    manager.updateProfile({
      name: new Name(newFirstName, newLastName),
      email: newEmail,
      phone: newPhone,
      address: newAddress,
    })

    await this.managerRepository.save(manager)

    this.logger.log(
      `Profile updated successfully for managerId: ${managerId}`,
      'UpdateOtherManagerProfileService',
    )

    return right({ manager })
  }
}

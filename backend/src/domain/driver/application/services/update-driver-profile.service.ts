import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { DriverRepository } from '../repositories/driver-repository'
import { Email } from '@/core/value-objects/email.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Address } from '@/core/value-objects/address.vo'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { Driver } from '../../enterprise/entities/driver.entity'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { SameCnhError } from './errors/same-cnh.error'
import { DriverAlreadyExistsError } from './errors/driver-already-exists'
import { SameEmailError } from './errors/same-email.error'
import { SamePhoneError } from './errors/same-phone.error'
import { Cnh } from '@/core/value-objects/cnh.vo'
import { CnhType } from '@prisma/client'

interface UpdateDriverProfileRequest {
  driverId: string
  firstName?: string
  lastName?: string
  email?: string
  cnh?: string
  cnhType?: string
  phone?: string
  street?: string
  number?: number
  district?: string
  zipCode?: string
  city?: string
  state?: string
}

type UpdateDriverProfileResponse = Either<
  | ResourceNotFoundError
  | DriverAlreadyExistsError
  | SameEmailError
  | SamePhoneError
  | SameCnhError,
  { driver: Driver }
>

@Injectable()
export class UpdateDriverProfileService {
  constructor(
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    driverId,
    firstName,
    lastName,
    email,
    phone,
    cnh,
    cnhType,
    street,
    number,
    district,
    zipCode,
    city,
    state,
  }: UpdateDriverProfileRequest): Promise<UpdateDriverProfileResponse> {
    this.logger.log(
      `Attempting to update profile for driverId: ${driverId}`,
      'UpdateDriverProfileService',
    )

    const driver = await this.driverRepository.findById(driverId)
    if (!driver) {
      const errorMessage = await this.i18n.translate('errors.driver.notFound')
      this.logger.warn(
        `Driver not found for profile update: driverId ${driverId}`,
        'UpdateDriverProfileService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    let newEmail = driver.email
    if (email) {
      const emailValueObject = new Email(email)

      if (driver.email.equals(emailValueObject)) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.sameEmail',
        )
        this.logger.warn(
          `New email is the same as current email for driverId: ${driverId}`,
          'UpdateDriverProfileService',
        )
        return left(new SameEmailError(errorMessage))
      }

      const existingWithSameEmail = await this.driverRepository.findByEmail(
        emailValueObject.toValue(),
      )

      if (existingWithSameEmail) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.alreadyExists',
        )
        this.logger.warn(
          `Email ${email} already in use during profile update for driverId: ${driverId}`,
          'UpdateDriverProfileService',
        )
        return left(new DriverAlreadyExistsError(errorMessage))
      }

      newEmail = emailValueObject
    }

    let newCnh = driver.cnh
    if (cnh) {
      const cnhValueObject = new Cnh(cnh)

      if (driver.cnh.equals(cnhValueObject)) {
        const errorMessage = await this.i18n.translate('errors.generic.sameCnh')
        this.logger.warn(
          `New cnh is the same as current cnh for driverId: ${driverId}`,
          'UpdateDriverProfileService',
        )
        return left(new SameEmailError(errorMessage))
      }

      const existingWithSameCnh = await this.driverRepository.findByCNH(
        cnhValueObject.toValue(),
      )

      if (existingWithSameCnh) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.alreadyExists',
        )
        this.logger.warn(
          `Chn ${Cnh} already in use during profile update for driverId: ${driverId}`,
          'UpdateDriverProfileService',
        )
        return left(new DriverAlreadyExistsError(errorMessage))
      }

      newCnh = cnhValueObject
    }

    let newPhone = driver.phone
    if (phone) {
      const phoneValueObject = new Phone(phone)

      if (driver.phone && driver.phone.equals(phoneValueObject)) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.samePhone',
        )
        this.logger.warn(
          `New phone is the same as current phone for driverId: ${driverId}`,
          'UpdateDriverProfileService',
        )
        return left(new SamePhoneError(errorMessage))
      }

      const existingWithSamePhone = await this.driverRepository.findByPhone(
        phoneValueObject.toValue(),
      )

      if (existingWithSamePhone) {
        const errorMessage = await this.i18n.translate(
          'errors.generic.alreadyExists',
        )
        this.logger.warn(
          `Phone ${phone} already in use during profile update for driverId: ${driverId}`,
          'UpdateDriverProfileService',
        )
        return left(new DriverAlreadyExistsError(errorMessage))
      }

      newPhone = phoneValueObject
    }

    const newFirstName = firstName || driver.name.getFirstName()

    const newLastName = lastName || driver.name.getLastName()

    let newAddress = driver.address

    const newCnhType = cnhType ? (cnhType as CnhType) : driver.cnhType

    if (street && number && district && zipCode && city && state) {
      newAddress = new Address(street, number, district, zipCode, city, state)
    }

    driver.updateProfile({
      name: new Name(newFirstName, newLastName),
      email: newEmail,
      phone: newPhone,
      address: newAddress,
      cnh: newCnh,
      cnhType: newCnhType,
    })

    await this.driverRepository.save(driver)

    this.logger.log(
      `Profile updated successfully for driverId: ${driverId}`,
      'UpdateDriverProfileService',
    )

    return right({ driver })
  }
}

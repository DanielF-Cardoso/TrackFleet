import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Either, left, right } from '@/core/errors/either'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { DriverAlreadyExistsError } from './errors/driver-already-exists'
import { Driver } from '../../enterprise/entities/driver.entity'
import { DriverRepository } from '../repositories/driver-repository'
import { Cnh } from '@/core/value-objects/cnh.vo'
import { Address } from '@/core/value-objects/address.vo'
import { Phone } from '@/core/value-objects/phone.vo'

export interface CreateDriverServiceRequest {
  firstName: string
  lastName: string
  email: string
  cnh: string
  cnhType: 'A' | 'B' | 'C' | 'D' | 'E'
  phone: string
  street: string
  number: number
  district: string
  city: string
  zipCode: string
  state: string
}

type CreateDriverServiceResponse = Either<
  DriverAlreadyExistsError,
  { driver: Driver }
>

@Injectable()
export class CreateDriverService {
  constructor(
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    firstName,
    lastName,
    email,
    cnh,
    cnhType,
    phone,
    street,
    number,
    district,
    city,
    state,
    zipCode,
  }: CreateDriverServiceRequest): Promise<CreateDriverServiceResponse> {
    this.logger.log(
      `Starting driver creation for email: ${email}`,
      'CreateDriverService',
    )

    const nameVO = new Name(firstName, lastName)
    const emailVO = new Email(email)
    const cnhVO = new Cnh(cnh)
    const phoneVO = new Phone(phone)

    const existingDriver = await this.driverRepository.findByEmail(
      emailVO.toValue(),
    )

    const existingCnh = await this.driverRepository.findByCNH(cnhVO.toValue())
    if (existingCnh) {
      const errorMessage = await this.i18n.translate(
        'errors.driver.cnhAlreadyExists',
      )
      this.logger.warn(`CNH already exists: ${cnh}`, 'CreateDriverService')
      return left(new DriverAlreadyExistsError(errorMessage))
    }

    if (existingDriver) {
      const errorMessage = await this.i18n.translate(
        'errors.driver.alreadyExists',
      )
      this.logger.warn(
        `Driver already exists with email: ${email}`,
        'CreateDriverService',
      )
      return left(new DriverAlreadyExistsError(errorMessage))
    }

    const existingPhone = await this.driverRepository.findByPhone(
      phoneVO.toValue(),
    )
    if (existingPhone) {
      const errorMessage = await this.i18n.translate(
        'errors.driver.phoneAlreadyExists',
      )
      this.logger.warn(`Phone already exists: ${phone}`, 'CreateDriverService')
      return left(new DriverAlreadyExistsError(errorMessage))
    }

    const driver = Driver.create({
      name: nameVO,
      email: emailVO,
      cnh: cnhVO,
      cnhType,
      phone: phoneVO,
      address: new Address(street, number, district, zipCode, city, state),
    })

    await this.driverRepository.create(driver)

    this.logger.log(
      `Driver created successfully with email: ${email}`,
      'CreateDriverService',
    )

    return right({ driver })
  }
}

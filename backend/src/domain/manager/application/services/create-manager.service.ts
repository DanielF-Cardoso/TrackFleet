import { HashGenerator } from '@/core/cryptography/hash-generator'
import { Manager } from '../../enterprise/entities/manager.entity'
import { ManagerRepository } from '../repositories/manager-repository'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Either, left, right } from '@/core/errors/either'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { Address } from '@/core/value-objects/address.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists.error'
import { EmailAlreadyExistsError } from '../../../../core/errors/email-already-exists.error'

export interface CreateManagerServiceRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  street: string
  number: number
  district: string
  zipCode: string
  city: string
  state: string
}

type CreateManagerServiceResponse = Either<
  EmailAlreadyExistsError | PhoneAlreadyExistsError,
  { manager: Manager }
>

@Injectable()
export class CreateManagerService {
  constructor(
    private managerRepository: ManagerRepository,
    private hashGenerator: HashGenerator,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) { }

  async execute({
    firstName,
    lastName,
    email,
    password,
    phone,
    street,
    number,
    district,
    zipCode,
    city,
    state,
  }: CreateManagerServiceRequest): Promise<CreateManagerServiceResponse> {
    this.logger.log(
      `Starting manager creation for email: ${email} and phone: ${phone}`,
      'CreateManagerService',
    )

    const nameVO = new Name(firstName, lastName)
    const emailVO = new Email(email)
    const phoneVO = new Phone(phone)
    const addressVO = new Address(
      street,
      number,
      district,
      zipCode,
      city,
      state,
    )

    const existingManager = await this.managerRepository.findByEmail(
      emailVO.toValue(),
    )

    const existingManagerByPhone = await this.managerRepository.findByPhone(
      phoneVO.toValue(),
    )

    if (existingManager) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.alreadyExists',
      )
      this.logger.warn(
        `Manager already exists with email: ${email}`,
        'CreateManagerService',
      )
      return left(new EmailAlreadyExistsError(errorMessage))
    }

    if (existingManagerByPhone) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.alreadyExistsByPhone',
      )
      this.logger.warn(
        `Manager already exists with phone: ${phone}`,
        'CreateManagerService',
      )
      return left(new PhoneAlreadyExistsError(errorMessage))
    }

    const hashedPassword = await this.hashGenerator.generateHash(password)

    const manager = Manager.create({
      name: nameVO,
      email: emailVO,
      password: hashedPassword,
      phone: phoneVO,
      address: addressVO,
      isActive: true,
    })

    await this.managerRepository.create(manager)

    this.logger.log(
      `Manager created successfully with email: ${email} and phone: ${phone}`,
      'CreateManagerService',
    )

    return right({ manager })
  }
}

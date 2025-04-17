import { HashGenerator } from '@/core/cryptography/hash-generator'
import { Manager } from '../../enterprise/entities/manager.entity'
import { ManagerRepository } from '../repositories/manager-repository'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { ManagerAlreadyExistsError } from './errors/manager-already-exists.error'
import { Either, left, right } from '@/core/errors/either'
import { Injectable } from '@nestjs/common'

export interface CreateManagerServiceRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

type CreateManagerServiceResponse = Either<
  ManagerAlreadyExistsError,
  { manager: Manager }
>

@Injectable()
export class CreateManagerService {
  constructor(
    private managerRepository: ManagerRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    firstName,
    lastName,
    email,
    password,
  }: CreateManagerServiceRequest): Promise<CreateManagerServiceResponse> {
    const nameVO = new Name(firstName, lastName)
    const emailVO = new Email(email)

    const existingManager = await this.managerRepository.findByEmail(
      emailVO.toValue(),
    )

    if (existingManager) {
      return left(new ManagerAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.generateHash(password)

    const manager = Manager.create({
      name: nameVO,
      email: emailVO,
      password: hashedPassword,
    })

    await this.managerRepository.create(manager)

    return right({ manager })
  }
}

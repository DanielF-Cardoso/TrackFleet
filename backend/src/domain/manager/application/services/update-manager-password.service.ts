import { Injectable } from '@nestjs/common'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { Either, left, right } from '@/core/errors/either'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { ManagerRepository } from '../repositories/manager-repository'
import { SamePasswordError } from './errors/same-password'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { InvalidPasswordError } from './errors/invalid-password.error'

interface UpdateManagerPasswordRequest {
  managerId: string
  currentPassword: string
  newPassword: string
}

type UpdateManagerPasswordResponse = Either<
  InvalidCredentialsError | ResourceNotFoundError | SamePasswordError,
  { success: true }
>

@Injectable()
export class UpdateManagerPasswordService {
  constructor(
    private managerRepository: ManagerRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
    private i18n: I18nService,
  ) {}

  async execute({
    managerId,
    currentPassword,
    newPassword,
  }: UpdateManagerPasswordRequest): Promise<UpdateManagerPasswordResponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      const errorMessage = await this.i18n.translate('errors.manager.notFound')
      return left(new ResourceNotFoundError(errorMessage))
    }

    const isValid = await this.hashComparer.compareHash(
      currentPassword,
      manager.password,
    )

    if (!isValid) {
      const errorMessage = await this.i18n.translate(
        'errors.manager.invalidPassword',
      )
      return left(new InvalidPasswordError(errorMessage))
    }

    if (currentPassword === newPassword) {
      const errorMessage = await this.i18n.translate(
        'errors.generic.samePassword',
      )
      return left(new SamePasswordError(errorMessage))
    }

    const hashedPassword = await this.hashGenerator.generateHash(newPassword)
    manager.updatePassword(hashedPassword)

    await this.managerRepository.save(manager)

    return right({ success: true })
  }
}

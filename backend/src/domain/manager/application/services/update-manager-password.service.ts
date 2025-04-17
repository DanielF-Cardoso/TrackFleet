import { Injectable } from '@nestjs/common'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { Either, left, right } from '@/core/errors/either'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { ManagerRepository } from '../repositories/manager-repository'
import { SamePasswordError } from './errors/same-password'

interface UpdateManagerPasswordRequest {
  managerId: string
  currentPassword: string
  newPassword: string
}

type UpdateManagerPasswordResponse = Either<
  InvalidCredentialsError,
  { success: true }
>

@Injectable()
export class UpdateManagerPasswordService {
  constructor(
    private managerRepository: ManagerRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    managerId,
    currentPassword,
    newPassword,
  }: UpdateManagerPasswordRequest): Promise<UpdateManagerPasswordResponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      return left(new InvalidCredentialsError())
    }

    const isValid = await this.hashComparer.compareHash(
      currentPassword,
      manager.password,
    )

    if (!isValid) {
      return left(new InvalidCredentialsError())
    }

    if (currentPassword === newPassword) {
      return left(new SamePasswordError())
    }

    const hashedPassword = await this.hashGenerator.generateHash(newPassword)
    manager.updatePassword(hashedPassword)

    await this.managerRepository.save(manager)

    return right({ success: true })
  }
}

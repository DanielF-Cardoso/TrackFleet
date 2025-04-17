import { Injectable } from '@nestjs/common'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { Encrypter } from '@/core/cryptography/encrypter'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

interface AuthenticateManagerRequest {
  email: string
  password: string
}

type AuthenticateManagerResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateManagerService {
  constructor(
    private managerRepository: ManagerRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateManagerRequest): Promise<AuthenticateManagerResponse> {
    const manager = await this.managerRepository.findByEmail(email)

    if (!manager) {
      return left(new InvalidCredentialsError())
    }

    const isValid = await this.hashComparer.compareHash(
      password,
      manager.password,
    )

    if (!isValid) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: manager.id.toString(),
    })

    return right({ accessToken })
  }
}

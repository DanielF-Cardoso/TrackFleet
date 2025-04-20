import { Injectable } from '@nestjs/common'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { Encrypter } from '@/core/cryptography/encrypter'
import { ManagerRepository } from '../repositories/manager-repository'
import { Either, left, right } from '@/core/errors/either'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { I18nService } from 'nestjs-i18n'

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
    private i18n: I18nService,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateManagerRequest): Promise<AuthenticateManagerResponse> {
    const manager = await this.managerRepository.findByEmail(email)

    if (!manager) {
      const errorMessage = await this.i18n.translate(
        'errors.auth.invalidCredentials',
      )
      return left(new InvalidCredentialsError(errorMessage))
    }

    const isValid = await this.hashComparer.compareHash(
      password,
      manager.password,
    )

    if (!isValid) {
      const errorMessage = await this.i18n.translate(
        'errors.auth.invalidCredentials',
      )
      return left(new InvalidCredentialsError(errorMessage))
    }

    const accessToken = await this.encrypter.encrypt({
      sub: manager.id.toString(),
    })

    return right({ accessToken })
  }
}

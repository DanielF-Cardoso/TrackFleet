import { AuthenticateManagerService } from './authenticate-manager.service'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { makeManager } from 'test/factories/manager/make-manager'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { Email } from '@/core/value-objects/email.vo'
import { FakeHashComparer } from 'test/cryptography/fake-hasher-compare'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

let sut: AuthenticateManagerService
let managerRepository: InMemoryManagerRepository

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  const hashComparer = new FakeHashComparer()
  const encrypter = new FakeEncrypter()

  sut = new AuthenticateManagerService(
    managerRepository,
    hashComparer,
    encrypter,
  )
})

describe('AuthenticateManagerService', () => {
  it('should authenticate and return an access token with valid credentials', async () => {
    const email = 'valid@auth.com'
    const password = '123456'

    const manager = makeManager({
      email: new Email(email),
      password: `hashed-${password}`,
    })

    await managerRepository.create(manager)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.accessToken).toBe(`token-${manager.id.toString()}`)
    }
  })

  it('should return error if email is incorrect', async () => {
    const email = 'valid@auth.com'
    const password = '123456'

    const manager = makeManager({
      email: new Email(email),
      password: `hashed-${password}`,
    })

    await managerRepository.create(manager)

    const result = await sut.execute({
      email: 'wrong@auth.com',
      password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should return error if password is incorrect', async () => {
    const email = 'valid@auth.com'
    const password = '123456'

    const manager = makeManager({
      email: new Email(email),
      password: `hashed-${password}`,
    })

    await managerRepository.create(manager)

    const result = await sut.execute({
      email,
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})

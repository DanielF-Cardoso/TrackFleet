import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager.repository'
import { CreateManagerService } from './create-manager.service'
import { FakeHashGenerator } from 'test/cryptography/fake-hasher'
import { makeManagerInput } from 'test/factories/manager/make-manager-input'
import { ManagerAlreadyExistsError } from './errors/manager-already-exists.error'
import { I18nService } from 'nestjs-i18n'
import { FakeLogger } from 'test/fake/logs-mocks'

let sut: CreateManagerService
let managerRepository: InMemoryManagerRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  managerRepository = new InMemoryManagerRepository()
  const hasher = new FakeHashGenerator()

  i18n = {
    translate: vi.fn(),
  } as unknown as I18nService

  logger = new FakeLogger()

  sut = new CreateManagerService(managerRepository, hasher, i18n, logger)
})

describe('CreateManagerService', () => {
  it('should be able to create a new manager', async () => {
    const createManagerData = makeManagerInput()

    const result = await sut.execute(createManagerData)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const manager = result.value.manager

      expect(manager.name.getFirstName()).toBe(createManagerData.firstName)
      expect(manager.name.getLastName()).toBe(createManagerData.lastName)
      expect(manager.email.toValue()).toBe(
        createManagerData.email.toLowerCase(),
      )
      expect(manager.password).toBe(`hashed-${createManagerData.password}`)
    }
  })

  it('should not allow creating a manager with the same email', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'A manager with this email already exists.',
    )

    const email = 'daniel@email.com'
    const createManagerData = makeManagerInput({ email })

    await sut.execute(createManagerData)

    const result = await sut.execute(createManagerData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ManagerAlreadyExistsError)
    if (result.value instanceof ManagerAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A manager with this email already exists.',
      )
    }
  })
})

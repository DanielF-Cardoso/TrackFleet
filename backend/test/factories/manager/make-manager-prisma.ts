import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaManagerMapper } from '@/infra/database/prisma/mappers/prisma-manager.mapper'
import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'
import { Name } from '@/core/value-objects/name.vo'
import { Email } from '@/core/value-objects/email.vo'
import { faker } from '@faker-js/faker'
import { Phone } from '@/core/value-objects/phone.vo'
import { Address } from '@/core/value-objects/address.vo'

interface MakePrismaManagerData {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

@Injectable()
export class ManagerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaManager(data: MakePrismaManagerData = {}): Promise<Manager> {
    const firstName = data.firstName ?? faker.person.firstName()
    const lastName = data.lastName ?? faker.person.lastName()
    const email = data.email ?? faker.internet.email()
    const password = data.password ?? faker.internet.password()

    const manager = Manager.create({
      name: new Name(firstName, lastName),
      phone: new Phone(faker.phone.number({ style: 'national' })),
      email: new Email(email),
      password,
      address: new Address(
        faker.location.street(),
        faker.number.int({ min: 1, max: 9999 }),
        faker.location.city(),
        faker.location.zipCode('#####-###'),
        faker.location.city(),
        faker.location.state(),
      ),
    })

    await this.prisma.manager.create({
      data: PrismaManagerMapper.toPersistence(manager),
    })

    return manager
  }
}

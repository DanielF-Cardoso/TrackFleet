import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/core/value-objects/address.vo'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'
import { Manager as PrismaManager, Prisma } from '@prisma/client'

export class PrismaManagerMapper {
  static toDomain(raw: PrismaManager): Manager {
    const manager = Manager.create(
      {
        name: new Name(raw.firstName, raw.lastName),
        email: new Email(raw.email),
        phone: new Phone(raw.phone),
        address: new Address(
          raw.street,
          raw.number,
          raw.district,
          raw.zipCode,
          raw.city,
          raw.state,
        ),
        password: raw.password,
        updatedAt: raw.updatedAt ?? undefined,
        lastLogin: raw.lastLogin ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )

    return manager
  }

  static toPersistence(manager: Manager): Prisma.ManagerUncheckedCreateInput {
    return {
      id: manager.id.toString(),
      firstName: manager.name.getFirstName(),
      lastName: manager.name.getLastName(),
      email: manager.email.toValue(),
      password: manager.password,
      phone: manager.phone.toValue(),
      street: manager.address.getStreet(),
      number: manager.address.getNumber(),
      district: manager.address.getDistrict(),
      zipCode: manager.address.getZipCode(),
      city: manager.address.getCity(),
      state: manager.address.getState(),
      createdAt: manager.createdAt,
      updatedAt: manager.updatedAt ?? undefined,
      lastLogin: manager.lastLogin ?? undefined,
    }
  }
}

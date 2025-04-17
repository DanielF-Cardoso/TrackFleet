import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'
import { Manager as PrismaManager, Prisma } from '@prisma/client'

export class PrismaManagerMapper {
  static toDomain(raw: PrismaManager): Manager {
    return Manager.create(
      {
        name: new Name(raw.firstName, raw.lastName),
        email: new Email(raw.email),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(manager: Manager): Prisma.ManagerUncheckedCreateInput {
    return {
      id: manager.id.toString(),
      firstName: manager.name.getFirstName(),
      lastName: manager.name.getLastName(),
      email: manager.email.toValue(),
      password: manager.password,
    }
  }
}

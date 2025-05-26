import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/core/value-objects/address.vo'
import { Cnh } from '@/core/value-objects/cnh.vo'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { Driver } from '@/domain/driver/enterprise/entities/driver.entity'
import { Driver as PrismaDriver, Prisma } from '@prisma/client'

export class PrismaDriverMapper {
  static toDomain(raw: PrismaDriver): Driver {
    const driver = Driver.create(
      {
        name: new Name(raw.firstName, raw.lastName),
        email: new Email(raw.email),
        phone: new Phone(raw.phone),
        cnh: new Cnh(raw.cnh),
        cnhType: raw.cnhType,
        address: new Address(
          raw.street,
          raw.number,
          raw.district,
          raw.zipCode,
          raw.city,
          raw.state,
        ),
        isActive: raw.isActive,
        updatedAt: raw.updatedAt ?? undefined,
        inactiveAt: raw.inactiveAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )

    return driver
  }

  static toPersistence(driver: Driver): Prisma.DriverUncheckedCreateInput {
    return {
      id: driver.id.toString(),
      firstName: driver.name.getFirstName(),
      lastName: driver.name.getLastName(),
      cnh: driver.cnh.toValue(),
      cnhType: driver.cnhType,
      email: driver.email.toValue(),
      phone: driver.phone.toValue(),
      street: driver.address.getStreet(),
      number: driver.address.getNumber(),
      district: driver.address.getDistrict(),
      zipCode: driver.address.getZipCode(),
      city: driver.address.getCity(),
      state: driver.address.getState(),
      isActive: driver.isActive,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt ?? undefined,
      inactiveAt: driver.inactiveAt ?? undefined,
    }
  }
}

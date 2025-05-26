import { Injectable } from '@nestjs/common'
import { DriverRepository } from '@/domain/driver/application/repositories/driver-repository'
import { Driver } from '@/domain/driver/enterprise/entities/driver.entity'
import { Email } from '@/core/value-objects/email.vo'
import { PrismaService } from '../prisma.service'
import { Phone } from '@/core/value-objects/phone.vo'
import { PrismaDriverMapper } from '../mappers/prisma-driver.mapper'

@Injectable()
export class PrismaDriverRepository implements DriverRepository {
  constructor(private prisma: PrismaService) {}

  async create(driver: Driver): Promise<Driver> {
    const data = PrismaDriverMapper.toPersistence(driver)

    const createdDriver = await this.prisma.driver.create({ data })

    return PrismaDriverMapper.toDomain(createdDriver)
  }

  async findByEmail(email: string | Email): Promise<Driver | null> {
    const value =
      typeof email === 'string' ? email.toLowerCase() : email.toValue()

    const driver = await this.prisma.driver.findUnique({
      where: { email: value },
    })

    if (!driver) return null

    return PrismaDriverMapper.toDomain(driver)
  }

  async findByPhone(phone: string | Phone): Promise<Driver | null> {
    const value =
      typeof phone === 'string' ? phone.toLowerCase() : phone.toValue()

    const driver = await this.prisma.driver.findFirst({
      where: { phone: value },
    })

    if (!driver) return null

    return PrismaDriverMapper.toDomain(driver)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.driver.delete({
      where: { id },
    })
  }

  async findById(id: string): Promise<Driver | null> {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    })

    if (!driver) return null

    return PrismaDriverMapper.toDomain(driver)
  }

  async save(driver: Driver): Promise<Driver> {
    const data = PrismaDriverMapper.toPersistence(driver)

    const updatedDriver = await this.prisma.driver.update({
      where: { id: data.id },
      data,
    })

    return PrismaDriverMapper.toDomain(updatedDriver)
  }

  async findAll(): Promise<Driver[]> {
    const drivers = await this.prisma.driver.findMany()
    return drivers.map(PrismaDriverMapper.toDomain)
  }

  async findByCNH(cnh: string): Promise<Driver | null> {
    const driver = await this.prisma.driver.findUnique({
      where: { cnh },
    })

    if (!driver) return null

    return PrismaDriverMapper.toDomain(driver)
  }
}

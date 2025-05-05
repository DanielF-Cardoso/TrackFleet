import { Injectable } from '@nestjs/common'
import { ManagerRepository } from '@/domain/manager/application/repositories/manager-repository'
import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'
import { PrismaManagerMapper } from '../mappers/prisma-manager.mapper'
import { Email } from '@/core/value-objects/email.vo'
import { PrismaService } from '../prisma.service'
import { Phone } from '@/core/value-objects/phone.vo'

@Injectable()
export class PrismaManagerRepository implements ManagerRepository {
  constructor(private prisma: PrismaService) {}

  async create(manager: Manager): Promise<Manager> {
    const data = PrismaManagerMapper.toPersistence(manager)

    const createdManager = await this.prisma.manager.create({ data })

    return PrismaManagerMapper.toDomain(createdManager)
  }

  async findByEmail(email: string | Email): Promise<Manager | null> {
    const value =
      typeof email === 'string' ? email.toLowerCase() : email.toValue()

    const manager = await this.prisma.manager.findUnique({
      where: { email: value },
    })

    if (!manager) return null

    return PrismaManagerMapper.toDomain(manager)
  }

  async findByPhone(phone: string | Phone): Promise<Manager | null> {
    const value =
      typeof phone === 'string' ? phone.toLowerCase() : phone.toValue()

    const manager = await this.prisma.manager.findUnique({
      where: { phone: value },
    })

    if (!manager) return null

    return PrismaManagerMapper.toDomain(manager)
  }

  async findById(id: string): Promise<Manager | null> {
    const manager = await this.prisma.manager.findUnique({
      where: { id },
    })

    if (!manager) return null

    return PrismaManagerMapper.toDomain(manager)
  }

  async save(manager: Manager): Promise<void> {
    const data = PrismaManagerMapper.toPersistence(manager)

    await this.prisma.manager.update({
      where: { id: data.id },
      data,
    })
  }

  async findAll(): Promise<Manager[]> {
    const managers = await this.prisma.manager.findMany()
    return managers.map(PrismaManagerMapper.toDomain)
  }
}

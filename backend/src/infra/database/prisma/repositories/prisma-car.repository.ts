import { Injectable } from '@nestjs/common'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { Car } from '@/domain/cars/enterprise/entities/car.entity'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { PrismaService } from '../prisma.service'
import { Renavam } from '@/core/value-objects/renavam.vo'
import { PrismaCarMapper } from '../mappers/prisma-car.mapper'

@Injectable()
export class PrismaCarRepository implements CarRepository {
  constructor(private prisma: PrismaService) {}

  async create(car: Car): Promise<Car> {
    const data = PrismaCarMapper.toPersistence(car)

    const createdCar = await this.prisma.cars.create({ data })

    return PrismaCarMapper.toDomain(createdCar)
  }

  async findByLicensePlate(
    licensePlate: string | LicensePlate,
  ): Promise<Car | null> {
    const value =
      typeof licensePlate === 'string' ? licensePlate : licensePlate.toValue()

    const car = await this.prisma.cars.findUnique({
      where: { licensePlate: value },
    })

    if (!car) return null

    return PrismaCarMapper.toDomain(car)
  }

  async findByRenavam(renavam: string | Renavam): Promise<Car | null> {
    const value = typeof renavam === 'string' ? renavam : renavam.toValue()

    const car = await this.prisma.cars.findUnique({
      where: { renavam: value },
    })

    if (!car) return null

    return PrismaCarMapper.toDomain(car)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cars.delete({
      where: { id },
    })
  }

  async findById(id: string): Promise<Car | null> {
    const car = await this.prisma.cars.findUnique({
      where: { id },
    })

    if (!car) return null

    return PrismaCarMapper.toDomain(car)
  }

  async findManyByIds(ids: string[]): Promise<Car[]> {
    const cars = await this.prisma.cars.findMany({
      where: { id: { in: ids } },
    })

    return cars.map(PrismaCarMapper.toDomain)
  }

  async save(car: Car): Promise<Car> {
    const data = PrismaCarMapper.toPersistence(car)

    const updatedCar = await this.prisma.cars.update({
      where: { id: data.id },
      data,
    })

    return PrismaCarMapper.toDomain(updatedCar)
  }

  async findAll(): Promise<Car[]> {
    const cars = await this.prisma.cars.findMany()
    return cars.map(PrismaCarMapper.toDomain)
  }
}

import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaClient } from '@prisma/client'
import { PrismaManagerRepository } from './repositories/prisma-manager.repository'
import { ManagerRepository } from '@/domain/manager/application/repositories/manager-repository'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { PrismaCarRepository } from './repositories/prisma-car.repository'

@Module({
  providers: [
    PrismaService,
    PrismaClient,
    {
      provide: ManagerRepository,
      useClass: PrismaManagerRepository,
    },
    {
      provide: CarRepository,
      useClass: PrismaCarRepository,
    },
  ],
  exports: [PrismaService, ManagerRepository, CarRepository],
})
export class DatabaseModule {}

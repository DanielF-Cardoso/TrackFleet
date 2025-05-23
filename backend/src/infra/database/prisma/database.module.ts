import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaClient } from '@prisma/client'
import { PrismaManagerRepository } from './repositories/prisma-manager.repository'
import { ManagerRepository } from '@/domain/manager/application/repositories/manager-repository'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { PrismaCarRepository } from './repositories/prisma-car.repository'
import { ManagerPasswordResetTokenRepository } from '@/domain/manager/application/repositories/manager-password-reset-token-repository'
import { PrismaManagerPasswordResetTokenRepository } from './repositories/prisma-manager-password-reset-token.repository'
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
    {
      provide: ManagerPasswordResetTokenRepository,
      useClass: PrismaManagerPasswordResetTokenRepository,
    },
  ],
  exports: [
    PrismaService,
    ManagerRepository,
    CarRepository,
    ManagerPasswordResetTokenRepository,
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaClient } from '@prisma/client'
import { PrismaManagerRepository } from './repositories/prisma-manager.repository'
import { ManagerRepository } from '@/domain/manager/application/repositories/manager-repository'

@Module({
  providers: [
    PrismaService,
    PrismaClient,
    {
      provide: ManagerRepository,
      useClass: PrismaManagerRepository,
    },
  ],
  exports: [PrismaService, ManagerRepository],
})
export class DatabaseModule {}

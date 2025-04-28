import { Module } from '@nestjs/common'
import { HealthCheckService } from './health-check.service'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { HealthCheckController } from './health-check.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthModule {}

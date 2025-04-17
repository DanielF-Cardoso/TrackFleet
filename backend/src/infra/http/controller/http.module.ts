import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateManagerController } from './authenticate-manager.controller'
import { AuthenticateManagerService } from '@/domain/manager/application/services/authenticate-manager.service'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { CreateManagerController } from './create-manager.controller'
import { CreateManagerService } from '@/domain/manager/application/services/create-manager.service'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateManagerController, CreateManagerController],
  providers: [AuthenticateManagerService, CreateManagerService],
})
export class HttpModule {}

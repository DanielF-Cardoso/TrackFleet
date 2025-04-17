import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateManagerController } from './authenticate-manager.controller'
import { AuthenticateManagerService } from '@/domain/manager/application/services/authenticate-manager.service'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { CreateManagerController } from './create-manager.controller'
import { CreateManagerService } from '@/domain/manager/application/services/create-manager.service'
import { GetManagerProfileService } from '@/domain/manager/application/services/get-manager-profile.service'
import { GetManagerProfileController } from './get-manager-profile.controller'
import { ListManagersController } from './list-managers.controllers'
import { ListManagersService } from '@/domain/manager/application/services/list-managers.service'
import { UpdateManagerPasswordController } from './update-manager-password.controller'
import { UpdateManagerPasswordService } from '@/domain/manager/application/services/update-manager-password.service'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateManagerController,
    CreateManagerController,
    GetManagerProfileController,
    ListManagersController,
    UpdateManagerPasswordController,
  ],
  providers: [
    AuthenticateManagerService,
    CreateManagerService,
    GetManagerProfileService,
    ListManagersService,
    UpdateManagerPasswordService,
  ],
})
export class HttpModule {}

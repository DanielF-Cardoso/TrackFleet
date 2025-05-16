import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateManagerController } from './manager/authenticate-manager.controller'
import { AuthenticateManagerService } from '@/domain/manager/application/services/authenticate-manager.service'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { CreateManagerService } from '@/domain/manager/application/services/create-manager.service'
import { GetManagerProfileService } from '@/domain/manager/application/services/get-manager-profile.service'
import { ListManagersService } from '@/domain/manager/application/services/list-managers.service'
import { UpdateManagerPasswordService } from '@/domain/manager/application/services/update-manager-password.service'
import { UpdateManagerProfileService } from '@/domain/manager/application/services/update-manager-profile.service'
import { DeleteManagerService } from '@/domain/manager/application/services/delete-manager.service'
import { ListManagersController } from './manager/list-managers.controller'
import { CreateManagerController } from './manager/create-manager.controller'
import { UpdateManagerPasswordController } from './manager/update-manager-password.controller'
import { UpdateManagerProfileController } from './manager/update-manager-profile.controller'
import { GetManagerProfileController } from './manager/get-manager-profile.controller'
import { DeleteManagerController } from './manager/delete-manager.controller'
import { CreateCarController } from './car/create-car.controller'
import { CreateCarService } from '@/domain/cars/application/services/create-car.service'
import { ListCarsController } from './car/list-car.controller'
import { ListCarService } from '@/domain/cars/application/services/list-car.service'
import { DeleteCarController } from './car/delete-car.controller'
import { DeleteCarService } from '@/domain/cars/application/services/delete-car.service'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateManagerController,
    CreateManagerController,
    GetManagerProfileController,
    ListManagersController,
    UpdateManagerPasswordController,
    UpdateManagerProfileController,
    DeleteManagerController,
    CreateCarController,
    ListCarsController,
    DeleteCarController,
  ],
  providers: [
    AuthenticateManagerService,
    CreateManagerService,
    GetManagerProfileService,
    ListManagersService,
    UpdateManagerPasswordService,
    UpdateManagerProfileService,
    DeleteManagerService,
    CreateCarService,
    ListCarService,
    DeleteCarService,
  ],
})
export class HttpModule {}

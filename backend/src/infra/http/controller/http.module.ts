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
import { ListManagersController } from './manager/list-managers.controller'
import { CreateManagerController } from './manager/create-manager.controller'
import { UpdateManagerPasswordController } from './manager/update-manager-password.controller'
import { UpdateManagerProfileController } from './manager/update-manager-profile.controller'
import { GetManagerProfileController } from './manager/get-manager-profile.controller'
import { CreateCarController } from './car/create-car.controller'
import { CreateCarService } from '@/domain/cars/application/services/create-car.service'
import { ListCarsController } from './car/list-car.controller'
import { ListCarService } from '@/domain/cars/application/services/list-car.service'
import { DeleteCarController } from './car/delete-car.controller'
import { DeleteCarService } from '@/domain/cars/application/services/delete-car.service'
import { GetCarByLicensePlateService } from '@/domain/cars/application/services/get-car-by-license-plate'
import { GetCarProfileController } from './car/get-car-by-licence-plate.controller'
import { InactivateManagerController } from './manager/inactivate-manager.controller'
import { InactivateManagerService } from '@/domain/manager/application/services/inactivate-manager.service'
import { EmailModule } from '@/infra/email/mailer.module'
import { ForgotPasswordController } from './manager/forgot-password.controller'
import { SendForgotPasswordEmailService } from '@/domain/manager/application/services/send-forgot-password-email.service'
@Module({
  imports: [DatabaseModule, CryptographyModule, EmailModule],
  controllers: [
    AuthenticateManagerController,
    CreateManagerController,
    GetManagerProfileController,
    ListManagersController,
    UpdateManagerPasswordController,
    UpdateManagerProfileController,
    InactivateManagerController,
    CreateCarController,
    ListCarsController,
    DeleteCarController,
    GetCarProfileController,
    ForgotPasswordController,
  ],
  providers: [
    AuthenticateManagerService,
    CreateManagerService,
    GetManagerProfileService,
    ListManagersService,
    UpdateManagerPasswordService,
    UpdateManagerProfileService,
    InactivateManagerService,
    CreateCarService,
    ListCarService,
    DeleteCarService,
    GetCarByLicensePlateService,
    SendForgotPasswordEmailService,
  ],
})
export class HttpModule {}

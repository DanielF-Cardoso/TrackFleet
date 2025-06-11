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
import { GetCarProfileController } from './car/get-car-by-license-plate.controller'
import { InactivateManagerController } from './manager/inactivate-manager.controller'
import { InactivateManagerService } from '@/domain/manager/application/services/inactivate-manager.service'
import { EmailModule } from '@/infra/email/mailer.module'
import { ForgotPasswordController } from './manager/forgot-password.controller'
import { SendForgotPasswordEmailService } from '@/domain/manager/application/services/send-forgot-password-email.service'
import { ResetPasswordController } from './manager/reset-password.controller'
import { ResetManagerPasswordService } from '@/domain/manager/application/services/reset-manager-password.service'
import { UpdateCarController } from './car/update-car.controller'
import { UpdateCarService } from '@/domain/cars/application/services/update-car.service'
import { CreateDriverController } from './driver/create-driver.controller'
import { CreateDriverService } from '@/domain/driver/application/services/create-driver.service'
import { ListDriversController } from './driver/list-drivers.controller'
import { ListDriversService } from '@/domain/driver/application/services/list-driver.service'
import { GetDriverProfileController } from './driver/get-driver-profile.controller'
import { GetDriverProfileService } from '@/domain/driver/application/services/get-driver-profile.service'
import { UpdateDriverController } from './driver/update-driver.controller'
import { UpdateDriverProfileService } from '@/domain/driver/application/services/update-driver-profile.service'
import { CreateEventController } from './event/create-event.controller'
import { CreateEventService } from '@/domain/event/application/services/create-event.service'
import { ListEventsController } from './event/list-events.controller'
import { ListEventsService } from '@/domain/event/application/services/list-events.service'
import { FinalizeEventService } from '@/domain/event/application/services/finalize-event.service'
import { FinalizeEventController } from './event/finalize-event.controller'
import { DeleteEventController } from './event/delete-event.controller'
import { DeleteEventService } from '@/domain/event/application/services/delete-event.service'
import { InactivateCarController } from './car/inactivate-car.controller'
import { InactivateCarService } from '@/domain/cars/application/services/inactivate-car.service'
import { InactivateDriverController } from './driver/inactivate-driver.controller'
import { InactivateDriverService } from '@/domain/driver/application/services/inactivate-driver.service'
import { ListDriverCarsByPeriodController } from './event/list-driver-cars-by-period.controller'
import { ListDriverCarsByPeriodService } from '@/domain/event/application/services/list-driver-cars-by-period.service'
import { ListUsedCarsByPeriodController } from './event/list-used-cars-by-period.controller'
import { ListUsedCarsByPeriodService } from '@/domain/event/application/services/list-used-cars-by-period.service'
import { UpdateOtherManagerProfileController } from './manager/update-other-manager-profile.controller'
import { UpdateOtherManagerProfileService } from '@/domain/manager/application/services/update-other-manager-profile.service'
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
    ResetPasswordController,
    UpdateCarController,
    CreateDriverController,
    ListDriversController,
    GetDriverProfileController,
    UpdateDriverController,
    CreateEventController,
    ListEventsController,
    FinalizeEventController,
    DeleteEventController,
    InactivateCarController,
    InactivateDriverController,
    ListDriverCarsByPeriodController,
    ListUsedCarsByPeriodController,
    UpdateOtherManagerProfileController,
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
    ResetManagerPasswordService,
    UpdateCarService,
    CreateDriverService,
    ListDriversService,
    GetDriverProfileService,
    UpdateDriverProfileService,
    CreateEventService,
    ListEventsService,
    FinalizeEventService,
    DeleteEventService,
    InactivateCarService,
    InactivateDriverService,
    ListDriverCarsByPeriodService,
    ListUsedCarsByPeriodService,
    UpdateOtherManagerProfileService,
  ],
})
export class HttpModule {}

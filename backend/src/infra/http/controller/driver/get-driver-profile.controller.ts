import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { GetDriverProfileService } from '@/domain/driver/application/services/get-driver-profile.service'
import { Request } from 'express'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { DriverPresenter } from '../../presenters/driver.presenter'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { GetDriverProfileDocs } from '@/infra/docs/drivers/get-driver-profile.doc'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@ApiTags('Motorista')
@Controller('drivers')
export class GetDriverProfileController {
  constructor(
    private getDriverProfile: GetDriverProfileService,
    private i18n: I18nService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @GetDriverProfileDocs()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const driverId = req.user.sub

    const result = await this.getDriverProfile.execute({ driverId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.driver.notFound'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      driver: DriverPresenter.toHTTP(result.value.driver),
    }
  }
}

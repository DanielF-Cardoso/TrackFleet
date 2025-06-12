import { InactivateDriverService } from '@/domain/driver/application/services/inactivate-driver.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Controller,
  Param,
  Patch,
  UseGuards,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpCode,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DriverHasActiveEventError } from '@/domain/driver/application/services/errors/driver-has-active-event.error'
import { InactivateDriverDocs } from '@/infra/docs/drivers/inactivate-driver.doc'

@ApiTags('Motorista')
@Controller('drivers')
export class InactivateDriverController {
  constructor(
    private inactivateDriverService: InactivateDriverService,
    private i18n: I18nService,
  ) {}

  @Patch('inactivate/:driverId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @InactivateDriverDocs()
  async inactivate(@Param('driverId') driverId: string) {
    const result = await this.inactivateDriverService.execute({ driverId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.driver.notFound'),
          )
        case DriverHasActiveEventError:
          throw new ConflictException(
            await this.i18n.translate('errors.driver.hasActiveEvent'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {}
  }
}

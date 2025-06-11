import { InactivateCarService } from '@/domain/cars/application/services/inactivate-car.service'
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
import { CarHasEventsError } from '@/domain/cars/application/services/errors/car-has-events-error'
import { InactivateCarDocs } from '@/infra/docs/car/inactivate-car.doc'

@ApiTags('Frota')
@Controller('cars')
export class InactivateCarController {
  constructor(
    private inactivateCarService: InactivateCarService,
    private i18n: I18nService,
  ) {}

  @Patch('inactivate/:carId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @InactivateCarDocs()
  async inactivate(@Param('carId') carId: string) {
    const result = await this.inactivateCarService.execute({ carId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.car.notFound'),
          )
        case CarHasEventsError:
          throw new ConflictException(
            await this.i18n.translate('errors.car.hasEvents'),
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

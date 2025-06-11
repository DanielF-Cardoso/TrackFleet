import {
  Controller,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  HttpCode,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { DeleteCarService } from '@/domain/cars/application/services/delete-car.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { CarHasEventsError } from '@/domain/cars/application/services/errors/car-has-events-error'
import { DeleteCarDocs } from '@/infra/docs/car/delete-car.doc'

@ApiTags('Frota')
@Controller('cars')
export class DeleteCarController {
  constructor(
    private deleteCarService: DeleteCarService,
    private i18n: I18nService,
  ) {}

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @DeleteCarDocs()
  async handle(@Param('id') id: string) {
    const result = await this.deleteCarService.execute({
      carId: id,
    })

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

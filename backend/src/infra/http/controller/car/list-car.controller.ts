import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { ListCarService } from '@/domain/cars/application/services/list-car.service'
import { CarPresenter } from '../../presenters/car.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ListCarDocs } from '@/infra/docs/car/list-car.doc'

@ApiTags('Frota')
@Controller('cars')
export class ListCarsController {
  constructor(
    private listCarsService: ListCarService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ListCarDocs()
  async handle() {
    const result = await this.listCarsService.execute()

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new HttpException('', HttpStatus.NO_CONTENT)
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      cars: result.value.cars.map(CarPresenter.toHTTP),
    }
  }
}

import { CreateCarService } from '@/domain/cars/application/services/create-car.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { CreateCarDto } from '../../dto/car/create-car.dto'
import { CarPresenter } from '../../presenters/car.presenter'
import { LicensePlateAlreadyExistsError } from '@/domain/cars/application/services/errors/license-plate-already-exists.error'
import { RenavamAlreadyExistsError } from '@/domain/cars/application/services/errors/renavam-already-exists.error'
import { ApiTags } from '@nestjs/swagger'
import { CreateCarDocs } from '@/infra/docs/car/create-car.doc'

@ApiTags('Frota')
@Controller('cars')
export class CreateCarController {
  constructor(
    private createCarService: CreateCarService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateCarDocs()
  async create(@Request() req, @Body() body: CreateCarDto) {
    const { licensePlate, brand, model, year, color, odometer, renavam } = body

    const result = await this.createCarService.execute({
      managerId: req.user.sub,
      licensePlate,
      brand,
      model,
      year,
      color,
      odometer,
      renavam,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case LicensePlateAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.car.licensePlateAlreadyExists'),
          )
        case RenavamAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.car.renavamAlreadyExists'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      car: CarPresenter.toHTTP(result.value.car),
    }
  }
}

import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CarPresenter } from '../../presenters/car.presenter'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { GetCarByLicensePlateService } from '@/domain/cars/application/services/get-car-by-license-plate'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { GetCarByLicensePlateDocs } from '@/infra/docs/car/get-car-by-license-plate.doc'

@ApiTags('Frota')
@Controller('car')
export class GetCarProfileController {
  constructor(
    private getCarProfile: GetCarByLicensePlateService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @GetCarByLicensePlateDocs()
  async getProfile(@Query('licensePlate') licensePlate: string) {
    const result = await this.getCarProfile.execute({
      licensePlate,
    })

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
      car: CarPresenter.toHTTP(result.value.car),
    }
  }
}

import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ListDriverCarsByPeriodService } from '@/domain/event/application/services/list-driver-cars-by-period.service'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { CarPresenter } from '../../presenters/car.presenter'
import { ListDriverCarsByPeriodDocs } from '@/infra/docs/event/list-driver-cars-by-period.doc'

@ApiTags('Eventos')
@Controller('events')
export class ListDriverCarsByPeriodController {
  constructor(
    private listDriverCarsByPeriodService: ListDriverCarsByPeriodService,
    private i18n: I18nService,
  ) {}

  @Get(':driverId/cars-by-period')
  @UseGuards(JwtAuthGuard)
  @ListDriverCarsByPeriodDocs()
  async list(
    @Param('driverId') driverId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        await this.i18n.translate('errors.generic.invalidPeriod'),
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    end.setUTCHours(23, 59, 59, 999)

    const result = await this.listDriverCarsByPeriodService.execute({
      driverId,
      startDate: start,
      endDate: end,
    })

    if (result.isLeft()) {
      throw new NotFoundException(
        await this.i18n.translate('errors.event.notFound'),
      )
    }

    return {
      cars: result.value.cars.map(CarPresenter.toHTTP),
    }
  }
}

import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ListUsedCarsByPeriodService } from '@/domain/event/application/services/list-used-cars-by-period.service'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { EventPresenter } from '../../presenters/event.presenter'
import { ListUsedCarsByPeriodDocs } from '@/infra/docs/event/list-used-cars-by-period.doc'

@ApiTags('Eventos')
@Controller('events')
export class ListUsedCarsByPeriodController {
  constructor(
    private listUsedCarsByPeriodService: ListUsedCarsByPeriodService,
    private i18n: I18nService,
  ) {}

  @Get('used-cars-by-period')
  @UseGuards(JwtAuthGuard)
  @ListUsedCarsByPeriodDocs()
  async list(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        await this.i18n.translate('errors.generic.invalidPeriod'),
      )
    }

    const result = await this.listUsedCarsByPeriodService.execute({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    if (result.isLeft()) {
      throw new NotFoundException(
        await this.i18n.translate('errors.event.notFound'),
      )
    }

    return {
      events: result.value.events.map((e) =>
        EventPresenter.toHTTPWithDetails(e.event, e.car, e.driver),
      ),
    }
  }
}

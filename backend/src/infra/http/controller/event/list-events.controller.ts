import { ListEventsService } from '@/domain/event/application/services/list-events.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { EventPresenter } from '../../presenters/event.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ListEventsDocs } from '@/infra/docs/event/list-event.doc'

@ApiTags('Eventos')
@Controller('events')
export class ListEventsController {
  constructor(
    private listEventsService: ListEventsService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ListEventsDocs()
  async list() {
    const result = await this.listEventsService.execute()

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
      events: result.value.events.map((e) =>
        EventPresenter.toHTTPWithDetails(e.event, e.car, e.driver),
      ),
    }
  }
}

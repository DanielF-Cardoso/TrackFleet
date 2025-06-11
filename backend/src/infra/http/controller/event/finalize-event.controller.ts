import { FinalizeEventService } from '@/domain/event/application/services/finalize-event.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { EventPresenter } from '../../presenters/event.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InvalidOdometerError } from '@/domain/event/application/services/errors/invalid-odometer.error'
import { OdometerToHighError } from '@/domain/event/application/services/errors/odometer-to-high.error'
import { FinalizeEventDTO } from '../../dto/event/finalize-event.dto'
import { InvalidEventStatusError } from '@/domain/event/application/services/errors/invalid-event-status.error'
import { FinalizeEventDocs } from '@/infra/docs/event/finalize-event.controller'

@ApiTags('Eventos')
@Controller('events')
export class FinalizeEventController {
  constructor(
    private finalizeEventService: FinalizeEventService,
    private i18n: I18nService,
  ) {}

  @Patch(':id/finalize')
  @UseGuards(JwtAuthGuard)
  @FinalizeEventDocs()
  async finalize(@Param('id') id: string, @Body() body: FinalizeEventDTO) {
    const { odometer } = body

    const result = await this.finalizeEventService.execute({
      eventId: id,
      odometer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.event.notFound'),
          )
        case InvalidEventStatusError:
          throw new BadRequestException(
            await this.i18n.translate('errors.event.invalidStatus'),
          )
        case InvalidOdometerError:
          throw new BadRequestException(
            await this.i18n.translate('errors.event.invalidOdometer'),
          )
        case OdometerToHighError:
          throw new BadRequestException(
            await this.i18n.translate('errors.event.odometerTooHigh'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      event: EventPresenter.toHTTP(result.value.event),
    }
  }
}

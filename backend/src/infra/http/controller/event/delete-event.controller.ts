import { DeleteEventService } from '@/domain/event/application/services/delete-event.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InvalidEventStatusError } from '@/domain/event/application/services/errors/invalid-event-status.error'
import { DeleteEventDocs } from '@/infra/docs/event/delete-event.doc'

@ApiTags('Eventos')
@Controller('events')
export class DeleteEventController {
  constructor(
    private deleteEventService: DeleteEventService,
    private i18n: I18nService,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @DeleteEventDocs()
  async delete(@Param('id') id: string) {
    const result = await this.deleteEventService.execute({
      eventId: id,
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
            await this.i18n.translate('errors.event.cannotDeleteFinalized'),
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

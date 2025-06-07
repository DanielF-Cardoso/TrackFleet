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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventPresenter } from '../../presenters/event.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InvalidEventStatusError } from '@/domain/event/application/services/errors/invalid-event-status.error'

@ApiTags('Eventos')
@Controller('events')
export class DeleteEventController {
  constructor(
    private deleteEventService: DeleteEventService,
    private i18n: I18nService,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Excluir evento',
    description: 'Exclui um evento de saída de veículo que ainda não foi finalizado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Evento excluído com sucesso.',
    schema: {
      example: {
        event: {
          id: '12345',
          carId: '123e4567-e89b-12d3-a456-426614174000',
          driverId: '123e4567-e89b-12d3-a456-426614174000',
          managerId: '123e4567-e89b-12d3-a456-426614174000',
          odometer: 150000,
          status: 'EXIT',
          startAt: '2024-03-19T10:00:00.000Z',
          endAt: null,
          createdAt: '2024-03-19T10:00:00.000Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Evento já finalizado.',
  })
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

    return {
      event: EventPresenter.toHTTP(result.value.event),
    }
  }
} 
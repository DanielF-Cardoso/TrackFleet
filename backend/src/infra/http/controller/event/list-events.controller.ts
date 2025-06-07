import { ListEventsService } from '@/domain/event/application/services/list-events.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventPresenter } from '../../presenters/event.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

@ApiTags('Eventos')
@Controller('events')
export class ListEventsController {
  constructor(
    private listEventsService: ListEventsService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar eventos',
    description: 'Lista todos os eventos registrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos retornada com sucesso.',
    schema: {
      example: {
        events: [
          {
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
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum evento encontrado.',
  })
  async list() {
    const result = await this.listEventsService.execute()

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.event.notFound'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      events: result.value.events.map(EventPresenter.toHTTP),
    }
  }
} 
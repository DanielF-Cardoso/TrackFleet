import { FinalizeEventService } from '@/domain/event/application/services/finalize-event.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventPresenter } from '../../presenters/event.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InvalidOdometerError } from '@/domain/event/application/services/errors/invalid-odometer.error'
import { OdometerToHighError } from '@/domain/event/application/services/errors/odometer-to-high.error'
import { FinalizeEventDTO } from '../../dto/event/finalize-event.dto'
import { InvalidEventStatusError } from '@/domain/event/application/services/errors/invalid-event-status.error'

@ApiTags('Eventos')
@Controller('events')
export class FinalizeEventController {
  constructor(
    private finalizeEventService: FinalizeEventService,
    private i18n: I18nService,
  ) {}

  @Patch(':id/finalize')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Finalizar evento',
    description: 'Finaliza um evento de saída de veículo, registrando sua entrada.',
  })
  @ApiResponse({
    status: 200,
    description: 'Evento finalizado com sucesso.',
    schema: {
      example: {
        event: {
          id: '12345',
          carId: '123e4567-e89b-12d3-a456-426614174000',
          driverId: '123e4567-e89b-12d3-a456-426614174000',
          managerId: '123e4567-e89b-12d3-a456-426614174000',
          odometer: 150000,
          status: 'ENTRY',
          startAt: '2024-03-19T10:00:00.000Z',
          endAt: '2024-03-19T18:00:00.000Z',
          createdAt: '2024-03-19T10:00:00.000Z',
          updatedAt: '2024-03-19T18:00:00.000Z',
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
    description: 'Evento ou carro não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou evento já finalizado.',
  })
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
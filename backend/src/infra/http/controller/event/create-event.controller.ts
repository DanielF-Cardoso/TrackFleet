import { CreateEventService } from '@/domain/event/application/services/create-event.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { EventPresenter } from '../../presenters/event.presenter'
import { CreateEventDTO } from '../../dto/event/create-event.dto'
import { CarNotFoundError } from '@/domain/event/application/services/errors/car-not-found.error'
import { DriverNotFoundError } from '@/domain/event/application/services/errors/driver-not-found.error'
import { InvalidOdometerError } from '@/domain/event/application/services/errors/invalid-odometer.error'
import { OdometerToHighError } from '@/domain/event/application/services/errors/odometer-to-high.error'
import { CarInUseError } from '@/domain/event/application/services/errors/car-in-use.error'
import { CreateEventDocs } from '@/infra/docs/event/create-event.doc'

@ApiTags('Eventos')
@Controller('events')
export class CreateEventController {
  constructor(
    private createEventService: CreateEventService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateEventDocs()
  async create(@Request() req, @Body() body: CreateEventDTO) {
    const { carId, driverId, odometer } = body
    const managerId = req.user.sub

    const result = await this.createEventService.execute({
      carId,
      driverId,
      managerId,
      odometer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CarNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.car.notFound'),
          )
        case DriverNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.driver.notFound'),
          )
        case InvalidOdometerError:
          throw new BadRequestException(
            await this.i18n.translate('errors.event.invalidOdometer'),
          )
        case OdometerToHighError:
          throw new BadRequestException(
            await this.i18n.translate('errors.event.odometerTooHigh'),
          )
        case CarInUseError:
          throw new BadRequestException(
            await this.i18n.translate('errors.event.carInUse'),
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

import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { ListDriversService } from '@/domain/driver/application/services/list-driver.service'
import { DriverPresenter } from '../../presenters/driver.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

@ApiTags('Motorista')
@Controller('drivers')
export class ListDriversController {
  constructor(
    private listDriversService: ListDriversService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle() {
    const result = await this.listDriversService.execute()

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
      drivers: result.value.drivers.map(DriverPresenter.toHTTP),
    }
  }
}

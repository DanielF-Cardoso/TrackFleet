import { CreateDriverService } from '@/domain/driver/application/services/create-driver.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common'

import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { CreateDriverDTO } from '../../dto/driver/create-driver.dto'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from '@/domain/manager/application/services/errors/phone-already-exists.error'
import { DriverPresenter } from '../../presenters/driver.presenter'
import { CreateDriverDocs } from '@/infra/docs/drivers/create-driver.doc'

@ApiTags('Motorista')
@Controller('drivers')
export class CreateDriverController {
  constructor(
    private createDriverService: CreateDriverService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateDriverDocs()
  async create(@Body() body: CreateDriverDTO) {
    const {
      firstName,
      lastName,
      email,
      cnh,
      cnhType,
      phone,
      street,
      number,
      district,
      zipCode,
      city,
      state,
    } = body

    const result = await this.createDriverService.execute({
      firstName,
      lastName,
      email,
      cnh,
      cnhType,
      phone,
      street,
      number,
      district,
      zipCode,
      city,
      state,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.driver.alreadyExists'),
          )
        case PhoneAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.driver.alreadyExistsByPhone'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      driver: DriverPresenter.toHTTP(result.value.driver),
    }
  }
}

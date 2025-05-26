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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateDriverDTO } from '../../dto/driver/create-driver.dto'
import { EmailAlreadyExistsError } from '@/domain/manager/application/services/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from '@/domain/manager/application/services/errors/phone-already-exists.error'
import { DriverPresenter } from '../../presenters/driver.presenter'

@ApiTags('Motoristas')
@Controller('drivers')
export class CreateDriverController {
  constructor(
    private createDriverService: CreateDriverService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar um novo motorista',
    description: 'Cria um novo motirista no sistema.',
  })
  @ApiBody({
    description: 'Dados necessários para criar um gestor.',
    type: CreateDriverDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Motorista criado com sucesso.',
    schema: {
      example: {
        driver: {
          id: '12345',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          cnh: '70069298086',
          cnhType: 'AB',
          phone: '1234567890',
          street: '123 Main St',
          number: 123,
          district: 'Downtown',
          zipCode: '12345',
          city: 'Anytown',
          state: 'CA',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 409,
    description: 'O motorista já existe.',
  })
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

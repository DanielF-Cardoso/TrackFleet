import {
  Body,
  Controller,
  Patch,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Param,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { SameEmailError } from '@/core/errors/same-email.error'
import { I18nService } from 'nestjs-i18n'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SamePhoneError } from '@/core/errors/same-phone.error'
import { UpdateDriverProfileService } from '@/domain/driver/application/services/update-driver-profile.service'
import { UpdateDriverDTO } from '../../dto/driver/update-driver.dto'
import { DriverPresenter } from '../../presenters/driver.presenter'
import { DriverNotFoundError } from '@/domain/driver/application/services/errors/driver-not-found'
import { SameCnhError } from '@/domain/driver/application/services/errors/same-cnh.error.error'

@ApiTags('Motoristas')
@Controller('drivers')
export class UpdateDriverController {
  constructor(
    private updateDriverProfileService: UpdateDriverProfileService,
    private readonly i18n: I18nService,
  ) { }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar perfil do motorista',
    description: 'Permite que um motorista autenticado atualize seu perfil.',
  })
  @ApiBody({
    description: 'Dados necessários para atualizar o perfil.',
    type: UpdateDriverDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso.',
    schema: {
      example: {
        manager: {
          id: '12345',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
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
    description: 'Gestor não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'O novo e‑mail não pode ser igual ao atual.',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um motorista com este e‑mail.',
  })
  async handle(@Body() body: UpdateDriverDTO, @Param('id') id: string) {
    const result = await this.updateDriverProfileService.execute({
      driverId: id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      cnh: body.cnh,
      cnhType: body.cnhType,
      phone: body.phone,
      street: body.street,
      number: body.number,
      district: body.district,
      zipCode: body.zipCode,
      city: body.city,
      state: body.state,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DriverNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFound'),
          )
        case SameEmailError:
          throw new ConflictException(
            await this.i18n.translate('errors.generic.sameEmail'),
          )
        case SamePhoneError:
          throw new ConflictException(
            await this.i18n.translate('errors.generic.samePhone'),
          )
        case SameCnhError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExists'),
          )
        default:
          throw new BadRequestException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      driver: DriverPresenter.toHTTP(result.value.driver),
    }
  }
}

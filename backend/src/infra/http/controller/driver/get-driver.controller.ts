import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { GetDriverProfileService } from '@/domain/driver/application/services/get-driver-profile.service'
import { Request } from 'express'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { DriverPresenter } from '../../presenters/driver.presenter'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DriverNotFoundError } from '@/domain/driver/application/services/errors/driver-not-found'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@ApiTags('Motoristas')
@Controller('drivers')
export class GetDriverController {
  constructor(
    private getDriverProfile: GetDriverProfileService,
    private i18n: I18nService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obter perfil do motorista',
    description: 'Retorna os dados do perfil do motorista autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do motorista retornado com sucesso.',
    schema: {
      example: {
        driver: {
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
    description: 'Motorista não encontrado.',
  })
  async getProfile(@Req() req: AuthenticatedRequest) {
    const driverId = req.user.sub

    const result = await this.getDriverProfile.execute({ driverId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DriverNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.driver.notFound'),
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

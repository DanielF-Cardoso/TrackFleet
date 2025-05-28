import {
  Controller,
  Get,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CarPresenter } from '../../presenters/car.presenter'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCarByLicensePlateService } from '@/domain/cars/application/services/get-car-by-license-plate'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

@ApiTags('Gestores')
@Controller('car')
export class GetCarProfileController {
  constructor(
    private getCarProfile: GetCarByLicensePlateService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obter perfil do carro',
    description: 'Retorna os dados do perfil do carro.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do carro retornado com sucesso.',
    schema: {
      example: {
        car: {
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
    description: 'Carro não encontrado.',
  })
  async getProfile(@Query('licensePlate') licensePlate: string) {
    const result = await this.getCarProfile.execute({
      licensePlate,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.car.notFound'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      car: CarPresenter.toHTTP(result.value.car),
    }
  }
}

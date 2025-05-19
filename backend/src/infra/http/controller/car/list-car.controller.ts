import {
  Controller,
  Get,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ListCarService } from '@/domain/cars/application/services/list-car.service'
import { CarPresenter } from '../../presenters/car.presenter'
import { CarNotFoundError } from '@/domain/cars/application/services/errors/car-not-found'

@ApiTags('Gestores')
@Controller('cars')
export class ListCarsController {
  constructor(
    private listCarsService: ListCarService,
    private i18n: I18nService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar carros',
    description: 'Retorna uma lista de todos os carros cadastrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de carros retornada com sucesso.',
    schema: {
      example: {
        cars: [
          {
            id: '12345',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
          },
          {
            id: '67890',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
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
    description: 'Nenhum carro encontrado.',
  })
  async handle() {
    const result = await this.listCarsService.execute()

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CarNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.car.notFoundAll'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      cars: result.value.car.map(CarPresenter.toHTTP),
    }
  }
}

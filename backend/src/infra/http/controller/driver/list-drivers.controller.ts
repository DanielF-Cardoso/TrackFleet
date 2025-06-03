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
import { ListDriversService } from '@/domain/driver/application/services/list-driver.service'
import { DriverPresenter } from '../../presenters/driver.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

@ApiTags('Motoristas')
@Controller('drivers')
export class ListDriversController {
  constructor(
    private listDriversService: ListDriversService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar motoristas',
    description:
      'Retorna uma lista de todos os motoristas cadastrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de motoristas retornada com sucesso.',
    schema: {
      example: {
        drivers: [
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
    description: 'Nenhum motorista encontrado.',
  })
  async handle() {
    const result = await this.listDriversService.execute()

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.driver.notFoundAll'),
          )
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

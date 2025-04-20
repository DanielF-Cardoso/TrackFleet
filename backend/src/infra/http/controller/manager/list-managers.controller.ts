import {
  Controller,
  Get,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ListManagersService } from '@/domain/manager/application/services/list-managers.service'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/domain/manager/application/services/errors/resource-not-found.error'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Gestores')
@Controller('managers')
export class ListManagersController {
  constructor(
    private listManagersService: ListManagersService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar gestores',
    description:
      'Retorna uma lista de todos os gestores cadastrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de gestores retornada com sucesso.',
    schema: {
      example: {
        managers: [
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
    description: 'Nenhum gestor encontrado.',
  })
  async handle() {
    const result = await this.listManagersService.execute()

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFoundAll'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      managers: result.value.managers.map(ManagerPresenter.toHTTP),
    }
  }
}

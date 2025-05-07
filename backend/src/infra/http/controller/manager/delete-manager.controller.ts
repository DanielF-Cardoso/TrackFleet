import {
  Controller,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Req,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { DeleteManagerService } from '@/domain/manager/application/services/delete-manager.service'
import { ResourceNotFoundError } from '@/domain/manager/application/services/errors/resource-not-found.error'
import { CannotDeleteLastManagerError } from '@/domain/manager/application/services/errors/cannot-delete-last-maanger.error'
import { CannotDeleteOwnAccountError } from '@/domain/manager/application/services/errors/cannot-delete-own-account.error'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

@ApiTags('Gestores')
@Controller('managers')
export class DeleteManagerController {
  constructor(
    private deleteManagerService: DeleteManagerService,
    private i18n: I18nService,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Deletar gestor',
    description:
      'Remove um gestor do sistema. Não é possível deletar o último gestor ou sua própria conta.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do gestor a ser deletado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Gestor deletado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar o último gestor ou sua própria conta.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Gestor não encontrado.',
  })
  async handle(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    const result = await this.deleteManagerService.execute({
      managerId: id,
      currentManagerId: req.user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFound'),
          )
        case CannotDeleteLastManagerError:
          throw new BadRequestException(
            await this.i18n.translate('errors.manager.cannotDeleteLast'),
          )
        case CannotDeleteOwnAccountError:
          throw new BadRequestException(
            await this.i18n.translate('errors.manager.cannotDeleteOwn'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {}
  }
}

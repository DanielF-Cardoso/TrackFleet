import {
  Controller,
  Param,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
  Req,
  Patch,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceNotFoundError } from '@/domain/manager/application/services/errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { InactivateManagerService } from '@/domain/manager/application/services/inactivate-manager.service'
import { LastManagerCannotBeInactivatedError } from '@/domain/manager/application/services/errors/last-manager-cannot-be-inactivated.error'
import { OwnAccountCannotBeInactivatedError } from '@/domain/manager/application/services/errors/own-account-cannot-be-inactivated.error'

@ApiTags('Gestores')
@Controller('managers')
export class InactivateManagerController {
  constructor(
    private inactivateManagerService: InactivateManagerService,
    private i18n: I18nService,
  ) {}

  @Patch('inactivate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Inativar gestor',
    description:
      'Inativa um gestor do sistema. Não é possível inativar o último gestor ou sua própria conta.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do gestor a ser inativado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Gestor inativado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Não é possível inativar o último gestor ou sua própria conta.',
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
    const result = await this.inactivateManagerService.execute({
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
        case LastManagerCannotBeInactivatedError:
          throw new ForbiddenException(
            await this.i18n.translate('errors.manager.cannotInactivateLast'),
          )
        case OwnAccountCannotBeInactivatedError:
          throw new ForbiddenException(
            await this.i18n.translate('errors.manager.cannotInactivateOwn'),
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

import {
  Controller,
  Param,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
  Req,
  Patch,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { InactivateManagerService } from '@/domain/manager/application/services/inactivate-manager.service'
import { LastManagerCannotBeInactivatedError } from '@/domain/manager/application/services/errors/last-manager-cannot-be-inactivated.error'
import { OwnAccountCannotBeInactivatedError } from '@/domain/manager/application/services/errors/own-account-cannot-be-inactivated.error'
import { InactivateManagerDocs } from '@/infra/docs/manager/inactive-manager.doc'

@ApiTags('Gestores')
@Controller('managers')
export class InactivateManagerController {
  constructor(
    private inactivateManagerService: InactivateManagerService,
    private i18n: I18nService,
  ) {}

  @Patch('inactivate/:id')
  @UseGuards(JwtAuthGuard)
  @InactivateManagerDocs()
  @HttpCode(204)
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

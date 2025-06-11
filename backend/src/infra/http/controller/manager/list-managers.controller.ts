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
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ApiTags } from '@nestjs/swagger'
import { ListManagersDocs } from '@/infra/docs/manager/list-manager.doc'

@ApiTags('Gestores')
@Controller('managers')
export class ListManagersController {
  constructor(
    private listManagersService: ListManagersService,
    private i18n: I18nService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ListManagersDocs()
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

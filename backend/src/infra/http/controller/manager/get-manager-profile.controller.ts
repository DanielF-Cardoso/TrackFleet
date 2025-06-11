import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { GetManagerProfileService } from '@/domain/manager/application/services/get-manager-profile.service'
import { Request } from 'express'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ApiTags } from '@nestjs/swagger'
import { GetManagerProfileDocs } from '@/infra/docs/manager/get-manager-profile.doc'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@ApiTags('Gestores')
@Controller('managers')
export class GetManagerProfileController {
  constructor(
    private getManagerProfile: GetManagerProfileService,
    private i18n: I18nService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @GetManagerProfileDocs()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const managerId = req.user.sub

    const result = await this.getManagerProfile.execute({ managerId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFound'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager),
    }
  }
}

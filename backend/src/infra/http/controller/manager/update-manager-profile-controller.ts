import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Request } from 'express'
import { UpdateManagerProfileService } from '@/domain/manager/application/services/update-manager-profile.service'
import { ResourceNotFoundError } from '@/domain/manager/application/services/errors/resource-not-found.error'
import { SameEmailError } from '@/domain/manager/application/services/errors/same-email'
import { ManagerAlreadyExistsError } from '@/domain/manager/application/services/errors/manager-already-exists.error'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { UpdateManagerProfileDTO } from '../../dto/manager/update-manager-profile.dto'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@Controller('managers/me')
export class UpdateManagerProfileController {
  constructor(
    private updateManagerProfileService: UpdateManagerProfileService,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() body: UpdateManagerProfileDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const managerId = req.user.sub

    const result = await this.updateManagerProfileService.execute({
      managerId,
      firstName: body.firstName ?? '',
      lastName: body.lastName ?? '',
      email: body.email ?? '',
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new UnauthorizedException('Manager not found')
        case SameEmailError:
          throw new BadRequestException('Email is the same as the current one')
        case ManagerAlreadyExistsError:
          throw new BadRequestException('Email already in use')
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager),
    }
  }
}

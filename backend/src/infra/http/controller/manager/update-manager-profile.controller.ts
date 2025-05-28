import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Request } from 'express'
import { UpdateManagerProfileService } from '@/domain/manager/application/services/update-manager-profile.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { SameEmailError } from '@/core/errors/same-email.error'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { UpdateManagerProfileDTO } from '../../dto/manager/update-manager-profile.dto'
import { I18nService } from 'nestjs-i18n'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SamePhoneError } from '@/core/errors/same-phone.error'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from '@/domain/manager/application/services/errors/phone-already-exists.error'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@ApiTags('Gestores')
@Controller('managers/me')
export class UpdateManagerProfileController {
  constructor(
    private updateManagerProfileService: UpdateManagerProfileService,
    private readonly i18n: I18nService,
  ) { }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar perfil do gestor',
    description: 'Permite que um gestor autenticado atualize seu perfil.',
  })
  @ApiBody({
    description: 'Dados necessários para atualizar o perfil.',
    type: UpdateManagerProfileDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso.',
    schema: {
      example: {
        manager: {
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
    description: 'Gestor não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'O novo e‑mail não pode ser igual ao atual.',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um gestor com este e‑mail.',
  })
  async handle(
    @Body() body: UpdateManagerProfileDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const managerId = req.user.sub

    const result = await this.updateManagerProfileService.execute({
      managerId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      street: body.street,
      number: body.number,
      district: body.district,
      zipCode: body.zipCode,
      city: body.city,
      state: body.state,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFound'),
          )
        case SameEmailError:
          throw new ConflictException(
            await this.i18n.translate('errors.generic.sameEmail'),
          )
        case SamePhoneError:
          throw new ConflictException(
            await this.i18n.translate('errors.generic.samePhone'),
          )
        case EmailAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExists'),
          )
        case PhoneAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExistsByPhone'),
          )
        default:
          throw new BadRequestException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager),
    }
  }
}

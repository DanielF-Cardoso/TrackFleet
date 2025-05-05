import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UpdateManagerPasswordService } from '@/domain/manager/application/services/update-manager-password.service'
import { Request } from 'express'
import { UpdateManagerPasswordDTO } from '../../dto/manager/update-manager-password.dto'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/domain/manager/application/services/errors/resource-not-found.error'
import { InvalidPasswordError } from '@/domain/manager/application/services/errors/invalid-password.error'
import { SamePasswordError } from '@/domain/manager/application/services/errors/same-password.error'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@ApiTags('Gestores')
@Controller('managers/password')
export class UpdateManagerPasswordController {
  constructor(
    private updateManagerPasswordService: UpdateManagerPasswordService,
    private readonly i18n: I18nService,
  ) { }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar senha do gestor',
    description: 'Permite que um gestor autenticado atualize sua senha.',
  })
  @ApiBody({
    description: 'Dados necessários para atualizar a senha.',
    type: UpdateManagerPasswordDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Senha atualizada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Senha atual inválida.',
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
    description: 'A nova senha não pode ser igual à senha atual.',
  })
  async handle(
    @Body() body: UpdateManagerPasswordDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const managerId = req.user.sub

    const result = await this.updateManagerPasswordService.execute({
      managerId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFound'),
          )
        case InvalidPasswordError:
          throw new BadRequestException(
            await this.i18n.translate('errors.auth.invalidPassword'),
          )
        case SamePasswordError:
          throw new ConflictException(
            await this.i18n.translate('errors.generic.samePassword'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      message: 'Password updated successfully',
    }
  }
}

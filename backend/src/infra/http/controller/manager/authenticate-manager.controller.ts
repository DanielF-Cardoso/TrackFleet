import {
  Body,
  Controller,
  Post,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { AuthenticateManagerService } from '@/domain/manager/application/services/authenticate-manager.service'
import { InvalidCredentialsError } from '@/domain/manager/application/services/errors/invalid-credentials.error'
import { AuthenticateManagerDTO } from '../../dto/manager/authenticate-manager.dto'
import { I18nService } from 'nestjs-i18n'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Gestores')
@Controller('login')
export class AuthenticateManagerController {
  constructor(
    private authenticateManager: AuthenticateManagerService,
    private i18n: I18nService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Autenticar gestor',
    description: 'Autentica um gestor e retorna um token de acesso.',
  })
  @ApiBody({
    description: 'Dados para autenticação do gestor.',
    type: AuthenticateManagerDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Autenticação realizada com sucesso.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciais inválidas.',
  })
  async login(@Body() body: AuthenticateManagerDTO) {
    const { email, password } = body

    const result = await this.authenticateManager.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException(
            await this.i18n.translate('errors.auth.invalidCredentials'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      accessToken: result.value.accessToken,
    }
  }
}

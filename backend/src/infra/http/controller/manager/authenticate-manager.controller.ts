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

@Controller('login')
export class AuthenticateManagerController {
  constructor(
    private authenticateManager: AuthenticateManagerService,
    private i18n: I18nService,
  ) {}

  @Post()
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

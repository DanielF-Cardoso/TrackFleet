import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { AuthenticateManagerService } from '@/domain/manager/application/services/authenticate-manager.service'
import { AuthenticateManagerDTO } from '../dto/authenticate-manager-body.dto'
import { InvalidCredentialsError } from '@/domain/manager/application/services/errors/invalid-credentials.error'

@Controller('login')
export class AuthenticateManagerController {
  constructor(private authenticateManager: AuthenticateManagerService) {}

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
          throw new UnauthorizedException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      accessToken: result.value.accessToken,
    }
  }
}

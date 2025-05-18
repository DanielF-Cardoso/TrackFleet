import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { ResetManagerPasswordService } from '@/domain/manager/application/services/reset-manager-password.service'
import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { InvalidTokenError } from '@/domain/manager/application/services/errors/invalid-token.error'
import { ResetPasswordDTO } from '../../dto/manager/reset-password.dto'

@ApiTags('Gestores')
@Controller('auth')
export class ResetPasswordController {
  constructor(
    private resetManagerPasswordService: ResetManagerPasswordService,
    private i18n: I18nService,
  ) {}

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset manager password using token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or password',
  })
  async handle(@Body() body: ResetPasswordDTO) {
    const result = await this.resetManagerPasswordService.execute({
      token: body.token,
      password: body.password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidTokenError:
          throw new BadRequestException(
            await this.i18n.translate('errors.auth.invalidToken'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return { message: await this.i18n.translate('success.passwordReset') }
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common'
import { ResetManagerPasswordService } from '@/domain/manager/application/services/reset-manager-password.service'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { InvalidTokenError } from '@/domain/manager/application/services/errors/invalid-token.error'
import { ResetPasswordDTO } from '../../dto/manager/reset-password.dto'
import { ResetPasswordDocs } from '@/infra/docs/manager/reset-password.doc'

@ApiTags('Gestores')
@Controller('auth')
export class ResetPasswordController {
  constructor(
    private resetManagerPasswordService: ResetManagerPasswordService,
    private i18n: I18nService,
  ) {}

  @Post('reset-password/:token')
  @ResetPasswordDocs()
  async handle(
    @Param('token') token: string,
    @Body() body: Pick<ResetPasswordDTO, 'password'>,
  ) {
    const result = await this.resetManagerPasswordService.execute({
      token,
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

    return {}
  }
}

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { SendForgotPasswordEmailService } from '@/domain/manager/application/services/send-forgot-password-email.service'
import { ForgotPasswordDTO } from '../../dto/manager/forgot-password.dto'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { TokenRequestTooSoonError } from '@/domain/manager/application/services/errors/token-request-too-soon.error'
import { ForgotPasswordDocs } from '@/infra/docs/manager/forgot-password.doc'

@ApiTags('Gestores')
@Controller('managers')
export class ForgotPasswordController {
  constructor(
    private sendForgotPasswordEmailService: SendForgotPasswordEmailService,
    private i18n: I18nService,
  ) {}

  @Post('forgot-password')
  @ForgotPasswordDocs()
  async handle(@Body() body: ForgotPasswordDTO) {
    const { email } = body

    const result = await this.sendForgotPasswordEmailService.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFound'),
          )
        case TokenRequestTooSoonError:
          throw new HttpException(
            await this.i18n.translate('errors.auth.tokenRequestTooSoon'),
            HttpStatus.TOO_MANY_REQUESTS,
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }
  }
}

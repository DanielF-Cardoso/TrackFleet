import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly i18n: I18nService) {
    super()
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      const message = this.i18n.translate('errors.unauthorized')

      throw new UnauthorizedException(message)
    }
    return user
  }
}

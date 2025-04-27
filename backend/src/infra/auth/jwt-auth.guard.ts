import {
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '../logger/logger.module'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {
    super()
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      const message = this.i18n.translate('errors.auth.unauthorized')

      this.logger.warn(`Unauthorized access attempt`, 'JwtAuthGuard')

      throw new UnauthorizedException(message)
    }
    return user
  }
}

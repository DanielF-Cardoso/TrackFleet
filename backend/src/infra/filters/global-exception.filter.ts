import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { EnvService } from '@/infra/env/env.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
    private readonly envService: EnvService,
  ) {}

  private maskIp(ip: string): string {
    const nodeEnv = this.envService.get('NODE_ENV')

    if (nodeEnv === 'production') {
      const ipv4Match = ip.match(/\d+\.\d+\.\d+\.\d+/)

      if (ipv4Match) {
        const parts = ipv4Match[0].split('.')
        parts[3] = '*'
        return parts.join('.')
      }

      if (ip.includes('::ffff:')) {
        const ipv4Part = ip.split('::ffff:')[1]
        if (ipv4Part) {
          const parts = ipv4Part.split('.')
          parts[3] = '*'
          return `::ffff:${parts.join('.')}`
        }
      }

      return 'masked'
    }

    return ip
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const ipRaw = request.ip || request.headers['x-forwarded-for'] || 'unknown'
    const ip = this.maskIp(ipRaw)
    const method = request.method
    const url = request.url
    const userAgent = request.headers['user-agent'] || 'unknown'

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const message = exception.message || 'No message'

      const logMessage = `HttpException: Status=${status}, Message=${message}, IP=${ip}, Method=${method}, URL=${url}, User-Agent=${userAgent}`

      if (status >= 400 && status < 500) {
        this.logger.warn(logMessage, 'GlobalExceptionFilter')
      } else {
        this.logger.error(logMessage, exception.stack, 'GlobalExceptionFilter')
      }
    } else {
      this.logger.error(
        `Unhandled Exception: ${JSON.stringify(exception)} | IP=${ip}, Method=${method}, URL=${url}`,
        (exception as any)?.stack,
        'GlobalExceptionFilter',
      )
    }

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
      })
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      })
    }
  }
}

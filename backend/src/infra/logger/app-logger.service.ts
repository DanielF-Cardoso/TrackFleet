import { Injectable } from '@nestjs/common'
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import { createLogger, format, transports } from 'winston'
import { EnvService } from '@/infra/env/env.service'
import { RequestContext } from '@/infra/logger/request-context'
import * as DailyRotateFile from 'winston-daily-rotate-file'

@Injectable()
export class AppLogger {
  private readonly logger

  constructor(private readonly envService: EnvService) {
    const prefix = this.envService.get('LOG_PREFIX')
    const environment = this.envService.get('NODE_ENV')
    const maxSize = this.envService.get('LOG_MAX_SIZE')
    const maxFiles = this.envService.get('LOG_MAX_FILES')

    const level =
      environment === 'production'
        ? 'info'
        : this.envService.get('LOG_LEVEL') || 'debug'

    this.logger = createLogger({
      level,
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, context }) => {
          const requestId = RequestContext.get<string>('requestId')
          const requestIdLog = requestId ? `[RequestID=${requestId}]` : ''
          return `[${prefix}] [${timestamp}] [${level.toUpperCase()}] ${requestIdLog} ${context ? '[' + context + ']' : ''} ${message}`
        }),
      ),
      transports: [
        new transports.Console({
          format: nestWinstonModuleUtilities.format.nestLike(prefix, {
            prettyPrint: true,
          }),
        }),
        new DailyRotateFile({
          dirname: 'logs',
          filename: `${prefix.toLowerCase()}-%DATE%-error.log`,
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          zippedArchive: true,
          maxSize,
          maxFiles,
        }),
        new DailyRotateFile({
          dirname: 'logs',
          filename: `${prefix.toLowerCase()}-%DATE%-combined.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize,
          maxFiles,
        }),
      ],
    })
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context })
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { context, trace })
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context })
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context })
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context })
  }
}

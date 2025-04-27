import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { AppLogger } from './app-logger.service'
import { Response } from 'express'
import chalk from 'chalk'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()

    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse<Response>()
    const { method, url, ip } = request

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - now
        const statusCode = response.statusCode

        const color =
          statusCode >= 500
            ? chalk.red
            : statusCode >= 400
              ? chalk.yellow
              : statusCode >= 300
                ? chalk.cyan
                : chalk.green

        const formattedStatusCode = color(statusCode)

        this.logger.log(
          `${method} ${url} ${formattedStatusCode} (${elapsedTime}ms) [IP: ${ip}]`,
          'HTTP Request',
        )
      }),
    )
  }
}

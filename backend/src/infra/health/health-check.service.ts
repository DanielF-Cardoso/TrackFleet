import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import * as os from 'os'
import { LOGGER_SERVICE } from '../logger/logger.module'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
    private readonly i18n: I18nService,
  ) {}

  async checkDatabase() {
    const uptime = os.uptime()
    const timestamp = new Date().toISOString()

    try {
      await this.prismaService.$queryRaw`SELECT 1`

      return {
        status: 'ok',
        uptime,
        timestamp,
        message: await this.i18n.translate('errors.generic.serviceHealthy'),
        check: {
          database: await this.i18n.translate(
            'errors.generic.databaseConnected',
          ),
        },
      }
    } catch (error) {
      this.logger.error(
        `Database connection failed: ${(error as Error).message}`,
        (error as Error).stack,
        'HealthCheckService',
      )

      return {
        status: 'error',
        uptime,
        timestamp,
        message: await this.i18n.translate('errors.generic.serviceUnhealthy'),
        check: {
          database: await this.i18n.translate(
            'errors.generic.databaseDisconnected',
          ),
        },
      }
    }
  }
}

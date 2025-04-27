import { Global, Module } from '@nestjs/common'
import { AppLogger } from './app-logger.service'
import { EnvModule } from '../env/env.module'

export const LOGGER_SERVICE = 'LOGGER_SERVICE'

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    AppLogger,
    {
      provide: LOGGER_SERVICE,
      useExisting: AppLogger,
    },
  ],
  exports: [LOGGER_SERVICE],
})
export class LoggerModule {}

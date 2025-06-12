import { NestFactory } from '@nestjs/core'
import { EnvService } from './infra/env/env.service'
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppLogger } from './infra/logger/app-logger.service'
import { LoggingInterceptor } from './infra/logger/logging.interceptor'
import { GlobalExceptionFilter } from './infra/filters/global-exception.filter'
import { LOGGER_SERVICE } from './infra/logger/logger.module'
import { RequestContext } from '@/infra/logger/request-context'
import { RequestIdInterceptor } from './infra/logger/request-id.interceptor'
import { AppModule } from './infra/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  const envService = app.get(EnvService)
  const logger = app.get(AppLogger)

  app.useLogger(logger)

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })

  const port = envService.get('PORT')
  const nodeEnv = envService.get('NODE_ENV')

  RequestContext.run(async () => {
    app.setGlobalPrefix('api/v1')

    app.useGlobalPipes(
      new I18nValidationPipe({
        whitelist: true,
        transform: true,
        validationError: {
          target: false,
          value: false,
        },
      }),
    )

    app.useGlobalInterceptors(new RequestIdInterceptor())
    app.useGlobalFilters(
      new GlobalExceptionFilter(app.get(LOGGER_SERVICE), envService),
    )

    app.useGlobalFilters(new I18nValidationExceptionFilter())

    app.useGlobalInterceptors(new LoggingInterceptor(logger))

    if (nodeEnv === 'development') {
      const config = new DocumentBuilder()
        .setTitle('TrackFleet API')
        .setDescription(
          'TrackFleet é uma API para gerenciamento de frotas de veículos.',
        )
        .setVersion('1.0')
        .build()

      const documentFactory = () => SwaggerModule.createDocument(app, config)
      SwaggerModule.setup('api/docs', app, documentFactory)
    } else {
      logger.log('Swagger documentation disabled in production', 'Bootstrap')
    }

    await app.listen(port)
  })
}

bootstrap()

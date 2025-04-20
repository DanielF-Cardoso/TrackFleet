import { NestFactory } from '@nestjs/core'
import { AppModule } from './infra/app.module'
import { EnvService } from './infra/env/env.service'
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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

  app.useGlobalFilters(new I18nValidationExceptionFilter())

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}

bootstrap()

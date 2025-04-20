import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/controller/http.module'
import { I18nModule } from '@/infra/i18n/i18n.module'

@Module({
  imports: [
    I18nModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}

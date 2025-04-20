import { EnvModule } from '@/infra/env/env.module'
import { EnvService } from '@/infra/env/env.service'
import { Module } from '@nestjs/common'
import {
  I18nModule as NestI18nModule,
  AcceptLanguageResolver,
  HeaderResolver,
  QueryResolver,
} from 'nestjs-i18n'
import * as path from 'path'

@Module({
  imports: [
    EnvModule,
    NestI18nModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        const environment = env.get('FALLBACK_LANGUAGE')
        return {
          fallbackLanguage: environment,
          loaderOptions: {
            path: path.resolve(__dirname),
            watch: true,
            filePattern: '*.json',
          },
        }
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
  exports: [NestI18nModule],
})
export class I18nModule {}

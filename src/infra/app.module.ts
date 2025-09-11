import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from '@/infra/provision/env/env'
import { RestModule } from '@/infra/rest/rest.module'
import { EnvProviderModule } from './provision/env/env-provider.module'


@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    RestModule,
    EnvProviderModule,
  ],
})
export class AppModule {}

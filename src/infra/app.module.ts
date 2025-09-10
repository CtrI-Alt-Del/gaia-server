import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from '@/infra/env/env'
import { EnvModule } from '@/infra/env/env.module'
import { RestModule } from '@/infra/rest/rest.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    RestModule,
    EnvModule,
  ],
})
export class AppModule {}

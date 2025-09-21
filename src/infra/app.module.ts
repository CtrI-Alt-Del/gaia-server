import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'

import { envSchema } from '@/infra/provision/env/env'
import { RestModule } from '@/infra/rest/rest.module'
import { EnvProviderModule } from './provision/env/env-provider.module'
import { AuthModule } from './auth/auth.module'
import { ClerkAuthGuard } from './auth/guards/clerk-auth.guard'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { QueueModule } from './queue/queue.module'
import { ClerkProvider } from './auth/passport/clerk-provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    EnvProviderModule,
    RestModule,
    QueueModule,
    AuthModule,
  ],
  // providers: [ Habilita proteção em todas as rotas
  //   ClerkProvider,
  //   {
  //     provide: APP_GUARD,
  //     useClass: ClerkAuthGuard,
  //   },
  // ],
})
export class AppModule {}

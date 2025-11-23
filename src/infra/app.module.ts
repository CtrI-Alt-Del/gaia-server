import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_GUARD } from '@nestjs/core'

import { envSchema } from '@/infra/provision/env/env'
import { RestModule } from '@/infra/rest/rest.module'
import { EnvProviderModule } from './provision/env/env-provider.module'
import { AuthModule } from './auth/auth.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EnvProvider } from './provision/env/env-provider'
import { AuthQueueModule } from './queue/auth/auth-queue.module'
import { TelemetryQueueModule } from './queue/telemetry/telemetry-queue.module'
import { AlertingQueueModule } from './queue/alerting/alerting-queue.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [EnvProviderModule],
      inject: [EnvProvider],
      useFactory: (envProvider: EnvProvider) => ({
        connection: {
          host: envProvider.get('REDIS_HOST'),
          port: envProvider.get('REDIS_PORT'),
          password: envProvider.get('REDIS_PASSWORD'),
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 100,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    AuthQueueModule,
    AlertingQueueModule,
    TelemetryQueueModule,
    EnvProviderModule,
    RestModule,
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

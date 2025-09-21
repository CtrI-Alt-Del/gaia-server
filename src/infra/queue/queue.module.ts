import { Module } from '@nestjs/common'
import { NestEventBroker } from './nest-event-broker'
import { CreateAccountJob } from './jobs/auth'
import { AuthProviderModule } from '../provision/auth/auth-provider.module'

@Module({
  imports: [AuthProviderModule],
  providers: [
    {
      provide: QueueModule.EVENT_BROKER,
      useClass: NestEventBroker,
    },
    CreateAccountJob,
  ],
  exports: [QueueModule.EVENT_BROKER],
})
export class QueueModule {
  static readonly EVENT_BROKER = 'EVENT_BROKER'
}

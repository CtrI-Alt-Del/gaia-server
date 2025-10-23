import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { DatabaseModule } from '@/infra/database/database.module'
import { AuthProviderModule } from '@/infra/provision/auth/auth-provider.module'
import { DEPENDENCIES } from '@/infra/constants'
import { BullMembershipProcessor } from '../bull/processors'
import { CreateAccountJob } from './jobs'

@Module({
  imports: [
    BullModule.registerQueue({
      name: DEPENDENCIES.queue.authQueue,
    }),
    DatabaseModule,
    AuthProviderModule,
  ],
  providers: [BullMembershipProcessor, CreateAccountJob],
})
export class AuthQueueModule {}

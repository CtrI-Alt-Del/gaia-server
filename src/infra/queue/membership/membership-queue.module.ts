import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { DatabaseModule } from '@/infra/database/database.module'
import { BullMembershipBroker } from '../bull/brokers'
import { DEPENDENCIES } from '@/infra/constants'

@Module({
  imports: [
    BullModule.registerQueue({
      name: DEPENDENCIES.queue.membershipQueue,
    }),
    DatabaseModule,
  ],
  providers: [
    {
      provide: DEPENDENCIES.queue.membershipBroker,
      useClass: BullMembershipBroker,
    },
  ],
  exports: [DEPENDENCIES.queue.membershipBroker],
})
export class MembershipQueueModule {}

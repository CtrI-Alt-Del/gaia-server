import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/infra/database/database.module'
import { CreateUserController } from './users/create-user.controller'
import { ListUsersController } from './users/list-users.controller'
import { UpdateUserController } from './users/update-user.controller'
import { ActivateUserController } from './users/activate-user.controller'
import { DeactivateUserController } from './users/deactivate-user.controller'
import { QueueModule } from '@/infra/queue/queue.module'

@Module({
  imports: [DatabaseModule, QueueModule],
  controllers: [
    ActivateUserController,
    DeactivateUserController,
    CreateUserController,
    ListUsersController,
    UpdateUserController,
  ],
})
export class MembershipRestModule {}

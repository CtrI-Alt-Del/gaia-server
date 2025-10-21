import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/infra/database/database.module'
import { CreateUserController } from './users/create-user.controller'
import { ListUsersController } from './users/list-users.controller'
import { UpdateUserController } from './users/update-user.controller'
import { ActivateUserController } from './users/activate-user.controller'
import { DeactivateUserController } from './users/deactivate-user.controller'
import { GetUserController } from './users/get-user.controller'
import { MembershipQueueModule } from '@/infra/queue/membership/membership-queue.module'

@Module({
  imports: [DatabaseModule, MembershipQueueModule],
  controllers: [
    ActivateUserController,
    DeactivateUserController,
    CreateUserController,
    ListUsersController,
    UpdateUserController,
    GetUserController,
  ],
})
export class MembershipRestModule {}

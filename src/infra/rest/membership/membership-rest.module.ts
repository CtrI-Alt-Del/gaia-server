import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/infra/database/database.module'
import { CreateUserController } from './users/create-user.controller'
import { ListUsersController } from './users/list-users.controller'
import { UpdateUserController } from './users/update-user.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserController, ListUsersController, UpdateUserController],
})
export class MembershipRestModule {}

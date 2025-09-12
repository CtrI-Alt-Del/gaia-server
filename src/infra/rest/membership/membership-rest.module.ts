import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/infra/database/database.module'
import { CreateUserController } from './users/create-user.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserController],
})
export class MembershipRestModule {}

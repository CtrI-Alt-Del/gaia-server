import { Inject, Param, Patch } from '@nestjs/common'

import { UsersRepository } from '@/core/global/interfaces'
import { ActivateUserUseCase } from '@/core/membership/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { UsersController } from './users.controller'

@UsersController('activate')
export class ActivateUserController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
  ) {}

  @Patch()
  async handle(@Param('userId') userId: string) {
    const useCase = new ActivateUserUseCase(this.repository)
    return await useCase.execute({ id: userId })
  }
}

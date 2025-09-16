import { Delete, Inject, Param } from '@nestjs/common'

import { UsersRepository } from '@/core/global/interfaces'
import { DeactivateUserUseCase } from '@/core/membership/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { UsersController } from './users.controller'

@UsersController(':userId')
export class DeactivateUserController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
  ) {}

  @Delete()
  async handle(@Param('userId') userId: string) {
    const useCase = new DeactivateUserUseCase(this.repository)
    return await useCase.execute({ id: userId })
  }
}

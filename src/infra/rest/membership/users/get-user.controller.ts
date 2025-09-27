import { GetUserUseCase } from '@/core/membership/use-cases'
import { Get, Inject, Param } from '@nestjs/common'
import { UsersRepository } from '@/core/membership/interfaces'
import { UsersController } from './users.controller'
import { DatabaseModule } from '@/infra/database/database.module'

@UsersController('/:userId')
export class GetUserController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
  ) {}

  @Get()
  async handle(@Param('userId') userId: string) {
    const useCase = new GetUserUseCase(this.repository)
    return await useCase.execute({ userId })
  }
}

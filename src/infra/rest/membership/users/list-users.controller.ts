import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { UsersRepository } from '@/core/global/interfaces'
import { ListUsersUseCase } from '@/core/membership/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { usersListingSchema } from '@/infra/validation/schemas/zod/membership'
import { UsersController } from './users.controller'

class ListUsersControllerRequestQuery extends createZodDto(usersListingSchema) {}

@UsersController()
export class ListUsersController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
  ) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListUsersControllerRequestQuery) {
    const useCase = new ListUsersUseCase(this.repository)
    return await useCase.execute(query)
  }
}

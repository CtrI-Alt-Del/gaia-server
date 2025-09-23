import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import { z } from 'zod'

import { UsersRepository } from '@/core/membership/interfaces'
import { ListUsersUseCase } from '@/core/membership/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { UsersController } from './users.controller'
import { statusSchema, stringSchema } from '@/infra/validation/schemas/zod/global'
import { plusIntegerSchema } from '@/infra/validation/schemas/zod/global'

export const schema = z.object({
  name: stringSchema.optional(),
  status: statusSchema,
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
})

class ListUsersControllerRequestQuery extends createZodDto(schema) {}

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

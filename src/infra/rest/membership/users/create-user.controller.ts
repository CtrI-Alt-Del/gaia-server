import { Body, Inject, Post, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { UsersRepository } from '@/core/membership/interfaces'
import { CreateUserUseCase } from '@/core/membership/use-cases'
import { Broker } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { userSchema } from '@/infra/validation/schemas/zod/membership'
import { UsersController } from './users.controller'
import { PublicRoute } from '@/infra/auth/decorators'
import { DEPENDENCIES } from '@/infra/constants'

class CreateUserControllerRequestBody extends createZodDto(userSchema) {}

@UsersController()
export class CreateUserController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
    @Inject(DEPENDENCIES.queue.membershipBroker)
    private readonly broker: Broker,
  ) {}

  @Post()
  @PublicRoute()
  @UsePipes(ZodValidationPipe)
  async handle(@Body() body: CreateUserControllerRequestBody) {
    const useCase = new CreateUserUseCase(this.repository, this.broker)
    return await useCase.execute(body)
  }
}

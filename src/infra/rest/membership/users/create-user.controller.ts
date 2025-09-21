import { Body, Inject, Post, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { UsersRepository } from '@/core/membership/interfaces'
import { CreateUserUseCase } from '@/core/membership/use-cases'
import { EventBroker } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { userSchema } from '@/infra/validation/schemas/zod/membership'
import { UsersController } from './users.controller'
import { QueueModule } from '@/infra/queue/queue.module'
import { PublicRoute } from '@/infra/auth/decorators'

class CreateUserControllerRequestBody extends createZodDto(userSchema) {}

@UsersController()
export class CreateUserController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
    @Inject(QueueModule.EVENT_BROKER)
    private readonly eventBroker: EventBroker,
  ) {}

  @Post()
  @PublicRoute()
  @UsePipes(ZodValidationPipe)
  async handle(@Body() body: CreateUserControllerRequestBody) {
    const useCase = new CreateUserUseCase(this.repository, this.eventBroker)
    return await useCase.execute(body)
  }
}

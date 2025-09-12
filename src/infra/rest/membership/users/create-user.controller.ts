import { Body, Inject, Post, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { UsersRepository } from '@/core/global/interfaces'
import { CreateUserUseCase } from '@/core/membership/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { userSchema } from '@/infra/validation/schemas/zod/membership'
import { UsersController } from './users.controller'

class CreateUserControllerRequestBody extends createZodDto(userSchema) {}

@UsersController()
export class CreateUserController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async handle(@Body() body: CreateUserControllerRequestBody) {
    const useCase = new CreateUserUseCase(this.repository)
    return await useCase.execute(body)
  }
}

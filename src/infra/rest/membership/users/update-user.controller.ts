import { Body, Inject, Param, Put, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { UsersRepository } from '@/core/membership/interfaces'
import { UpdateUserUseCase } from '@/core/membership/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { userSchema } from '@/infra/validation/schemas/zod/membership'
import { UsersController } from './users.controller'

class UpdateUserControllerRequestBody extends createZodDto(userSchema) {}

@UsersController()
export class UpdateUserController {
  constructor(
    @Inject(DatabaseModule.USERS_REPOSITORY)
    private readonly repository: UsersRepository,
  ) {}

  @Put(':userId')
  @UsePipes(ZodValidationPipe)
  async handle(
    @Param('userId') userId: string,
    @Body() body: UpdateUserControllerRequestBody,
  ) {
    const useCase = new UpdateUserUseCase(this.repository)
    return await useCase.execute({ ...body, id: userId })
  }
}

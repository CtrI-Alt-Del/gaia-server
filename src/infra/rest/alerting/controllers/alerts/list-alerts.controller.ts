import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import z from 'zod'

import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { ListAlertsUseCase } from '@/core/alerting/use-cases/list-alerts-use-case'

import { plusIntegerSchema, stringSchema } from '@/infra/validation/schemas/zod/global'
import { DatabaseModule } from '@/infra/database/database.module'
import { AlertsController } from './alerts.controller'

export const schema = z.object({
  level: stringSchema.optional().default('all'),
  date: stringSchema.optional(),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
})

class ListAlertsControllerRequestQuery extends createZodDto(schema) {}

@AlertsController()
export class ListAlertsController {
  constructor(
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly repository: AlertsRepository,
  ) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListAlertsControllerRequestQuery) {
    const useCase = new ListAlertsUseCase(this.repository)
    return await useCase.execute(query)
  }
}

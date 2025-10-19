import { Body, Inject, Post, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type { AlarmsRepository } from '@/core/global/interfaces'
import { CreateAlarmUseCase } from '@/core/alerting/use-cases/create-alarms-use-case'

import { alarmSchema } from '@/infra/validation/schemas/zod/alerting/alarm-schema'
import { DatabaseModule } from '@/infra/database/database.module'
import { AlarmsController } from './alarms.controller'

class RequestBody extends createZodDto(alarmSchema) {}

@AlarmsController()
export class CreateAlarmsController {
  constructor(
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly repository: AlarmsRepository,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(alarmSchema))
  async handle(@Body() body: RequestBody) {
    const useCase = new CreateAlarmUseCase(this.repository)
    return await useCase.execute(body)
  }
}

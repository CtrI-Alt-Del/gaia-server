import { updateAlarmSchema } from '@/infra/validation/schemas/zod/alerting/update-alarm-schema'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import { AlarmsController } from './alarms.controller'
import { Body, Inject, Param, Put } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { AlarmsRepository } from '@/core/alerting/interfaces'
import { UpdateAlarmUseCase } from '@/core/alerting/use-cases/update-alarms-use-case'

class UpdateAlarmRequestBody extends createZodDto(updateAlarmSchema) {}

const bodyValidationPipe = new ZodValidationPipe(updateAlarmSchema)

@AlarmsController()
export class UpdateAlarmController {
  constructor(
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly repository: AlarmsRepository,
  ) {}

  @Put('/:alarmId')
  async handle(
    @Body(bodyValidationPipe) body: UpdateAlarmRequestBody,
    @Param('alarmId') id: string,
  ) {
    const useCase = new UpdateAlarmUseCase(this.repository)
    return await useCase.execute({ data: body, id })
  }
}

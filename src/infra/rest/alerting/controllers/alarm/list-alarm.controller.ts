import { plusIntegerSchema, statusSchema, stringSchema } from "@/infra/validation/schemas/zod/global";
import { createZodDto, ZodValidationPipe } from "nestjs-zod";
import z from "zod";
import { AlarmController } from "./alarm.controller";
import { Get, Inject, Query, UsePipes } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module";
import { AlarmsRepository } from "@/core/global/interfaces";
import { ListAlarmUseCase } from "@/core/alerting/use-cases/list-alarm-use-case";

export const schema = z.object({
  name: stringSchema.optional(),
  status: statusSchema.optional().default('all'),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
})

class ListAlarmsControllerRequestQuery extends createZodDto(schema) {}

@AlarmController()
export class ListAlarmController{
  constructor(
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly repository: AlarmsRepository,
  ) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListAlarmsControllerRequestQuery) {
    const useCase = new ListAlarmUseCase(this.repository)
    return await useCase.execute(query)
  }
}
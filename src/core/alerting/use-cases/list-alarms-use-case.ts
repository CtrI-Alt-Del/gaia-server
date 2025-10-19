import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import { AlarmsRepository } from '@/core/alerting/interfaces'
import { UseCase } from '@/core/global/interfaces'
import { AlarmDto } from '../dtos/alarm.dto'
import { Id, PlusInteger, Status, Text } from '@/core/global/domain/structures'

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  status: string
  level?: string
}

export class ListAlarmsUseCase
  implements UseCase<Request, CursorPaginationDto<AlarmDto>>
{
  constructor(private readonly repository: AlarmsRepository) {}

  async execute(params: Request): Promise<CursorPaginationDto<AlarmDto>> {
    const pagination = await this.repository.findMany({
      nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
      previousCursor: params.previousCursor
        ? Id.create(params.previousCursor)
        : undefined,
      pageSize: PlusInteger.create(params.pageSize),
      status: Status.create(params.status),
      level: params.level ? Text.create(params.level) : undefined,
    })

    return pagination.map((alarm) => alarm.dto).dto
  }
}

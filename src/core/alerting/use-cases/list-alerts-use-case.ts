import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import { AlertsRepository } from '../interfaces/alerts-repository'
import { UseCase } from '@/core/global/interfaces'
import { Id, PlusInteger, Text, Timestamp } from '@/core/global/domain/structures'
import { AlertDto } from '../dtos/alert-dto'

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  level?: string
  date?: string
}

export class ListAlertsUseCase
  implements UseCase<Request, CursorPaginationDto<AlertDto>>
{
  constructor(private readonly repository: AlertsRepository) {}

  async execute(params: Request): Promise<CursorPaginationDto<AlertDto>> {
    const pagination = await this.repository.findMany({
      nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
      previousCursor: params.previousCursor
        ? Id.create(params.previousCursor)
        : undefined,
      pageSize: PlusInteger.create(params.pageSize),
      level: params.level ? Text.create(params.level) : undefined,
      date: params.date ? Timestamp.createFromString(params.date) : undefined,
    })

    return pagination.map((alert) => alert.dto).dto
  }
}

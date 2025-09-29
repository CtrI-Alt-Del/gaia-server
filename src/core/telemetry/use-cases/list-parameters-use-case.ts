import { Id, PlusInteger, Status, Text } from '@/core/global/domain/structures'
import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import type { UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'

type Request = {
  name?: string
  status: string
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  status: string
  name?: string
}

export class ListParametersUseCase
  implements UseCase<Request, CursorPaginationDto<ParameterDto>> {
  constructor(private readonly repository: ParametersRepository) { }

  async execute(params: Request): Promise<CursorPaginationDto<ParameterDto>> {
    const pagination = await this.repository.findMany({
      nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
      previousCursor: params.previousCursor
        ? Id.create(params.previousCursor)
        : undefined,
      pageSize: PlusInteger.create(params.pageSize),
      status: Status.create(params.status),
      name: params.name ? Text.create(params.name) : undefined,
    })

    return pagination.map((parameter) => parameter.dto).dto
  }
}

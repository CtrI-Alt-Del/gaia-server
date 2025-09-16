import { Id, Logical, PlusInteger } from '@/core/global/domain/structures'
import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import type { UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'


type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  isActive: boolean
}

export class ListParametersUseCase
  implements UseCase<Request, CursorPaginationDto<ParameterDto>>
{
  constructor(private readonly repository: ParametersRepository) {}

  async execute(params: Request): Promise<CursorPaginationDto<ParameterDto>> {
    const pagination = await this.repository.findMany({
      nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
      previousCursor: params.previousCursor
        ? Id.create(params.previousCursor)
        : undefined,
      pageSize: PlusInteger.create(params.pageSize),
      isActive: Logical.create(params.isActive),
    })

    return pagination.map((parameter) => parameter.dto).dto
  }
}

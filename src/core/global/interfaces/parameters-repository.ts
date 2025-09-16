import { CursorPagination, Id } from '@/core/global/domain/structures'
import { ParametersListParams } from '@/core/global/types'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'

export interface ParametersRepository {
  add(parameter: Parameter): Promise<void>
  findById(id: Id): Promise<Parameter | null>
  findMany(params: ParametersListParams): Promise<CursorPagination<Parameter>>
  replace(parameter: Parameter): Promise<void>
  deleteById(id: Id): Promise<void>
}

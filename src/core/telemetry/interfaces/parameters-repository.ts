import { CursorPagination, Id, Text } from '@/core/global/domain/structures'
import { ParametersListParams } from '@/core/global/types'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'

export interface ParametersRepository {
  add(parameter: Parameter): Promise<void>
  findById(id: Id): Promise<Parameter | null>
  findMany(params: ParametersListParams): Promise<CursorPagination<Parameter>>
  findManyByIds(ids: Id[]): Promise<Parameter[]>
  findParametersByStationId(stationId: Id): Promise<Parameter[]>
  findParameterByCode(code: Text): Promise<Parameter | null>
  replace(parameter: Parameter): Promise<void>
  deleteById(id: Id): Promise<void>
}

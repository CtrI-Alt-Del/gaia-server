import { Id } from "@/core/global/domain/structures";
import { ParametersListParams } from "@/core/global/types";
import { Parameter } from "@/core/telemetry/entities/parameter";

export interface ParametersRepository {
  add(parameter: Parameter): Promise<void>
  findById(id: Id): Promise<Parameter | null>
  findMany(params: ParametersListParams): Promise<Parameter[]>
  update(parameter: Parameter): Promise<void>
  deleteById(id: Id): Promise<void>
}

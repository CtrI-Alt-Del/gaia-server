import { Id } from "@/core/global/domain/structures";
import { Parameter } from "@/core/telemetry/entities/parameter";

export interface ParametersRepository {
  add(parameter: Parameter): Promise<void>
  findById(id: Id): Promise<Parameter | null>
  findMany(): Promise<Parameter[]>
  update(parameter: Parameter): Promise<void>
  deleteById(id: Id): Promise<void>
}

import { CursorPagination } from "@/core/global/domain/structures";
import { MeasurementListParams } from "@/core/global/types/measurement-list-params";
import { MeasurementDto } from "../domain/dtos/measurement-dto";

export interface MeasurementRepository{
    findMany(params: MeasurementListParams): Promise<CursorPagination<MeasurementDto>>
}
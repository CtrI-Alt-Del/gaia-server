import { Alarm } from "@/core/alerting/domain/entities/alarm";
import { AlarmListingParams } from "../types/alarm-list-params";
import { CursorPagination } from "../domain/structures";
import { Id } from "@/core/global/domain/structures";

export interface AlarmsRepository {
    add(alarm: Alarm): Promise<void>
    findMany(params: AlarmListingParams): Promise<CursorPagination<Alarm>>
    findById(id: Id): Promise<Alarm | null>
    replace(alarm: Alarm): Promise<void>
}

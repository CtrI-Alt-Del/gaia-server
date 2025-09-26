import { Alarm } from "@/core/alerting/domain/entities/alarm";
import { AlarmListingParams } from "../types/alarm-list-params";
import { CursorPagination } from "../domain/structures";

export interface AlarmsRepository {
    add(alarm: Alarm): Promise<void>
    findMany(params: AlarmListingParams): Promise<CursorPagination<Alarm>>
}

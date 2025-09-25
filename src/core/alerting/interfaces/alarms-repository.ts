import { Alarm } from "@/core/alerting/domain/entities/alarm";
import { Id } from "@/core/global/domain/structures";

export interface AlarmsRepository {
    add(alarm: Alarm): Promise<void>
    findById(id: Id): Promise<Alarm | null>
}

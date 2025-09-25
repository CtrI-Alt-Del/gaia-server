import { Alarm } from "@/core/alerting/domain/entities/alarm";

export interface AlarmsRepository {
    add(alarm: Alarm): Promise<void>
}

import { Id } from "@/core/global/domain/structures"
import { AlarmsRepository, UseCase } from "@/core/global/interfaces"
import { AlarmNotFoundError } from "@/core/alerting/domain/errors/alarm-not-found-error"
import { Alarm } from "../domain/entities/alarm"
import { AlarmAlreadyDeactivatedError } from "@/core/alerting/domain/errors/alarm-already-deactivated-error"

type Request = {
    id: string
}

export class DeactivateAlarmUseCase implements UseCase<Request, void>{
    constructor(private readonly repository: AlarmsRepository) {}

    async execute(alarmDto: Request): Promise<void> {
        const alarm = await this.findById(Id.create(alarmDto.id))
        
        if (alarm.isActive.isFalse) {
            throw new AlarmAlreadyDeactivatedError()
        }

        alarm.deactivate()

        await this.repository.replace(alarm)
    }

    async findById(id: Id): Promise<Alarm>{
        const alarm = await this.repository.findById(id)
        if (!alarm) throw new AlarmNotFoundError()
        return alarm
    }
}
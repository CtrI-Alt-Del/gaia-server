import { Id } from "@/core/global/domain/structures"
import { AlarmsRepository, UseCase } from "@/core/global/interfaces"
import { AlarmAlreadyActivatedError } from "@/core/telemetry/domain/errors/alarm-already-activated-error"
import { AlarmNotFoundError } from "@/core/telemetry/domain/errors/alarm-not-found-error"
import { Alarm } from "../domain/entities/alarm"

type Request = {
    id: string
}

export class DeactivateAlarmUseCase implements UseCase<Request, void>{
    constructor(private readonly repository: AlarmsRepository) {}

    async execute(alarmDto: Request): Promise<void> {
        const alarm = await this.findById(Id.create(alarmDto.id))
        
        if (alarm.isActive.isTrue) {
            throw new AlarmAlreadyActivatedError()
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
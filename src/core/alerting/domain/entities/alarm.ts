import { Entity } from "@/core/global/domain/abstracts"
import { Text } from "@/core/global/domain/structures"
import { Measurement } from "@/core/telemetry/entities/measurement"
import { AlarmDto } from "../../dtos/alarm.dto"

type AlarmProps = {
    name: Text
    measure: Measurement
}

export class Alarm extends Entity<AlarmProps>{
    static create(dto: AlarmDto): Alarm{
        return new Alarm(
            {
                name: Text.create(dto.name),
                measure: Measurement.create(dto.measure)
            },
            dto.id
        )
    }

    get name(): Text{
        return this.props.name
    }

    get measure(): Measurement{
        return this.props.measure
    }

    get dto(): AlarmDto{
        return {
            id: this.id.value,
            name: this.name.value,
            measure: this.measure.dto
        }
    }
}
import { Entity } from "@/core/global/domain/abstracts"
import { Logical, Text, Timestamp } from "@/core/global/domain/structures"
import { AlarmDto } from "../../dtos/alarm.dto"
import { ParameterAggregate } from "../../aggregate/parameter-aggregate"

type AlarmProps = {
    message: Text
    parameter: ParameterAggregate
    isActive: Logical
    createdAt: Timestamp
    updatedAt?: Timestamp
}

export class Alarm extends Entity<AlarmProps>{
    static create(dto: AlarmDto): Alarm{
        return new Alarm(
            {
                message: Text.create(dto.message),
                parameter: dto.parameter,
                isActive: Logical.create(dto.isActive),
                createdAt: Timestamp.create(dto.createdAt)
            },
            dto.id
        )
    }

    get message(): Text{
        return this.props.message
    }

    get parameter(): ParameterAggregate {
        return this.props.parameter
    }

    get isActive(): Logical{
        return this.props.isActive
    }

    get createdAt(): Timestamp {
        return this.props.createdAt
    }

    get updatedAt(): Timestamp | undefined{
        return this.props.updatedAt
    }

    get dto(): AlarmDto{
        return {
            id: this.id.value,
            message: this.message.value,
            parameter: this.parameter,
            isActive: this.isActive.value,
            createdAt: this.createdAt.value,
            updatedAt: this.updatedAt?.value
        }
    }
}
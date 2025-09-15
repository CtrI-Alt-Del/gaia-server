import { Aggregate } from "@/core/global/domain/abstracts/aggregate";
import { Logical, Timestamp } from "@/core/global/domain/structures";
import { Parameter } from "@/core/telemetry/entities/parameter";
import { ParameterAggregateDto } from "../dtos/parameteraggregate.dto";

type ParameterAggregateProps = {
    isActive: Logical
    createdAt: Timestamp
    updatedAt?: Timestamp
}

export class ParameterAggregate extends Aggregate<ParameterAggregateProps, Parameter>{
    static create(dto: ParameterAggregateDto){
        return new ParameterAggregate(
            {
                isActive: Logical.create(dto.isActive),
                createdAt: Timestamp.create(dto.createdAt)
            },
            Parameter.create(dto.parameter),
            "Parameter",
            dto.id
        )
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
}
import { BigInteger, Logical, Text, Timestamp } from "@/core/global/domain/structures"
import { Entity } from "@/core/global/domain/abstracts"
import { AlertRuleDto } from "../../dtos/alertrule.dto"
import Operation from "../structures/operation"

type AlertRuleProps = {
    name: Text
    threshold: BigInteger
    operation: Operation
    isActive: Logical
    createdAt: Timestamp
    updatedAt?: Timestamp 
}

export default class AlertRule extends Entity<AlertRuleProps>{
    static create(dto: AlertRuleDto){
        return new AlertRule(
            {
                name: Text.create(dto.name),
                threshold: BigInteger.create(dto.threshold),
                operation: Operation.create(dto.operation),
                isActive: Logical.create(dto.isActive),
                createdAt: Timestamp.create(dto.createdAt)
            },
            dto.id
        )
    }

    get name(): Text{
        return this.props.name
    }

    get threshold(): BigInteger{
        return this.props.threshold
    }

    get operation(): Operation{
        return this.props.operation
    }

    get dto(): AlertRuleDto{
        return {
            id: this.id.value,
            name: this.name.value,
            threshold: this.threshold.value,
            operation: this.operation.toString(),
            isActive: this.props.isActive.value,
            createdAt: this.props.createdAt.value,
            updatedAt: this.props.updatedAt?.value
        }
    }
}
import { BigInteger, Text } from "@/core/global/domain/structures"
import Operation from "../structures/Operation"
import { Entity } from "@/core/global/domain/abstracts"
import { AlertRuleDto } from "../../dtos/alertrule.dto"

type AlertRuleProps = {
    name: Text
    threshold: BigInteger
    operation: Operation
}

export default class AlertRule extends Entity<AlertRuleProps>{
    static create(dto: AlertRuleDto){
        return new AlertRule(
            {
                name: Text.create(dto.name),
                threshold: BigInteger.create(dto.threshold),
                operation: Operation.create(dto.operation)
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
            operation: this.operation.toString()
        }
    }
}
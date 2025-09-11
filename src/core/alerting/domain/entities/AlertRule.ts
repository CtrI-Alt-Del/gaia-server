import { Text } from "@/core/global/domain/structures"
import Operation from "../structures/Operation"
import { Entity } from "@/core/global/domain/abstracts"

type AlertRuleProps = {
    name: Text
    threshold: BigInteger
    operation: Operation
}

export default class AlertRule extends Entity<AlertRuleProps>{


    public getName(): Text{
        return this.props.name
    }

    public getThreshold(): BigInteger{
        return this.props.threshold
    }

    public getOperation(): Operation{
        return this.props.operation
    }
}
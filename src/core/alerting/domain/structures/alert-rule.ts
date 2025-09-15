import { BigInteger} from "@/core/global/domain/structures"
import Operation from "./Operation"

type Type = {threshold: bigint, operation: string}

export default class AlertRule{
    public readonly threshold: BigInteger
    public readonly operation: Operation

    private constructor(rule: Type) {
        this.threshold = BigInteger.create(rule.threshold)
        this.operation = Operation.create(rule.operation)
    }

    static create(rule: Type){
        return new AlertRule(rule)
    }
}
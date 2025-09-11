import { Text } from "@/core/global/domain/structures"
import Operation from "../structures/Operation"

export default class AlertRule{
    private name: Text
    private threshold: BigInteger
    private operation: Operation

    constructor(name: Text, threshold: BigInteger, operation: Operation){
        this.name = name
        this.threshold = threshold
        this.operation = operation
    }

    public getName(): Text{
        return this.name
    }

    public getThreshold(): BigInteger{
        return this.threshold
    }

    public getOperation(): Operation{
        return this.operation
    }
}
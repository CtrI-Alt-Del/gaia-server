export type AlertRuleDto = {
    id: string
    name: string
    threshold: bigint
    operation: string
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}
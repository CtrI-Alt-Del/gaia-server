import { AlertsRepository, UseCase } from "@/core/global/interfaces"

type Request = {
    timePeriod: 'MONTHLY' | 'WEEKLY'
}

export class CountAlertsByTimePeriod implements UseCase<Request, {criticalCount: number, warningCount: number, time: string}[]> {
    constructor(private readonly repository: AlertsRepository) {}

    async execute(params: Request): Promise<{criticalCount: number, warningCount: number, time: string}[]> {
        const alerts = await this.repository.countByTimePeriod(params.timePeriod)

        return alerts
    }
}
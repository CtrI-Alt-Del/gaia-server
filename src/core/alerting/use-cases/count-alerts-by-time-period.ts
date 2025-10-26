import { AlertsRepository, UseCase } from "@/core/global/interfaces"

type Request = {
    timePeriod: 'MONTHLY' | 'WEEKLY'
}

export class CountAlertsByTimePeriod implements UseCase<Request, {countCritical: number, countWarning: number, time: string}[]> {
    constructor(private readonly repository: AlertsRepository) {}

    async execute(params: Request): Promise<{countCritical: number, countWarning: number, time: string}[]> {
        const alerts = await this.repository.countByTimePeriod(params.timePeriod)

        return alerts
    }
}
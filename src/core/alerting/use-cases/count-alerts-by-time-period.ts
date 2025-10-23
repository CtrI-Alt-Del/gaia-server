import { AlertsRepository, UseCase } from "@/core/global/interfaces"

type Request = {
    timePeriod: 'YEAR' | 'WEEK'
}

export class CountAlertsByTimePeriod implements UseCase<Request, {count: number, time: string}> {
    constructor(private readonly repository: AlertsRepository) {}

    async execute(params: Request): Promise<{ count: number; time: string }> {
        const alerts = await this.repository.countByTimePeriod(params.timePeriod)

        return alerts
    }
}
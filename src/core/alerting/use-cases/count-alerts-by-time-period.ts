import { TimePeriod } from '@/core/global/domain/structures'
import { AlertsRepository, UseCase } from '@/core/global/interfaces'

type Request = {
  timePeriod: string
}

type Response = {
  criticalCount: number
  warningCount: number
  time: string
}

export class CountAlertsByTimePeriod implements UseCase<Request, Response[]> {
  constructor(private readonly repository: AlertsRepository) {}

  async execute({ timePeriod }: Request): Promise<Response[]> {
    const alerts = await this.repository.countByTimePeriod(TimePeriod.create(timePeriod))

    return alerts
  }
}

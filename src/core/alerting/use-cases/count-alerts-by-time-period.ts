import { TimePeriod } from '@/core/global/domain/structures'
import { AlertsRepository, UseCase } from '@/core/global/interfaces'

type Request = {
  timePeriod: string
}

export class CountAlertsByTimePeriod
  implements UseCase<Request, { count: number; time: string }[]>
{
  constructor(private readonly repository: AlertsRepository) {}

  async execute({ timePeriod }: Request): Promise<{ count: number; time: string }[]> {
    const alerts = await this.repository.countByTimePeriod(TimePeriod.create(timePeriod))
    return alerts
  }
}

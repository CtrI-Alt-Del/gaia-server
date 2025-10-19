import { Get, Inject } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { StationsRepository } from '@/core/global/interfaces'
import { AlarmsRepository } from '@/core/alerting/interfaces'
import { GetDashboardSummaryUseCase } from '@/core/dashboard/use-cases/get-dashboard-summary-use-case'

@DashboardController()
export class DashboardSummaryController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly alarmsRepository: AlarmsRepository,
  ) {}

  @Get('summary')
  async handle() {
    try {
      const useCase = new GetDashboardSummaryUseCase(
        this.stationsRepository,
        this.alarmsRepository,
      )
      return await useCase.execute()
    } catch (error) {
      console.error('Erro no dashboard summary:', error)
      return {
        title: 'Erro interno',
        message: error?.message || 'Erro desconhecido',
        stack: error?.stack || error,
      }
    }
  }
}

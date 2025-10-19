import { Get, Inject } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { StationsRepository } from '@/core/global/interfaces'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { GetDashboardSummaryUseCase } from '@/core/dashboard/use-cases/get-dashboard-summary-use-case'

@DashboardController()
export class DashboardSummaryController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly alertsRepository: AlertsRepository,
  ) {}

  @Get('summary')
  async handle() {
    try {
      const useCase = new GetDashboardSummaryUseCase(
        this.stationsRepository,
        this.alertsRepository,
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

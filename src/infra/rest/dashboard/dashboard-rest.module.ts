import { Module } from '@nestjs/common'
import { DashboardSummaryController } from './controllers/dashboard-summary.controller'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardSummaryController],
})
export class DashboardRestModule {}

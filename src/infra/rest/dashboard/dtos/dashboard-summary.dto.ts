import { z } from 'zod'

export const dashboardSummaryResponseSchema = z.object({
  totalStations: z.number(),
  activeStationsPercentage: z.number(),
  warningAlerts: z.number(),
  criticalAlerts: z.number(),
})

export type DashboardSummaryResponseDto = z.infer<typeof dashboardSummaryResponseSchema>

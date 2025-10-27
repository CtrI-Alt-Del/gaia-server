import { ParameterAggregateDto } from '@/core/alerting/dtos/parameter-aggregate-dto'

export type MeasurementDto = {
  value: number
  createdAt: Date
  parameter: ParameterAggregateDto
}

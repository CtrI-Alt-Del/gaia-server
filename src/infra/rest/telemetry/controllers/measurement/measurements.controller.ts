import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function MeasurementsController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Measurements'),
    Controller(`/telemetry/measurements${endpoint ? `/${endpoint}` : ''}`),
  )
}

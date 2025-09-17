import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function StationsController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Stations'),
    Controller(`/telemetry/stations${endpoint ? `/${endpoint}` : ''}`),
  )
}

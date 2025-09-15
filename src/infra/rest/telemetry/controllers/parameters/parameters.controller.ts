import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function ParametersController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Parameters'),
    Controller(`/telemetry/parameters${endpoint ? `/${endpoint}` : ''}`),
  )
}

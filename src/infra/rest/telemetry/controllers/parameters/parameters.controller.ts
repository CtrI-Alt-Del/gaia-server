import { Controller } from '@nestjs/common'

export function ParametersController(endpoint?: string): ClassDecorator {
  return Controller(`/telemetry/parameters${endpoint ? `/${endpoint}` : ''}`)
}

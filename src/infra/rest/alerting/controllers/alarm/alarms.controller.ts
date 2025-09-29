import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function AlarmsController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Alarms'),
    Controller(`/alerting/alarms${endpoint ? `/${endpoint}` : ''}`),
  )
}

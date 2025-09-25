import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function AlarmController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Alarms'),
    Controller(`/alerting/alarm${endpoint ? `/${endpoint}` : ''}`),
  )
}

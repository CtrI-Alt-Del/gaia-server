import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function AlertsController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Alerts'),
    Controller(`/alerting/alerts${endpoint ? `/${endpoint}` : ''}`),
  )
}

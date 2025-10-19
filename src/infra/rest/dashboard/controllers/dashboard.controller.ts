import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function DashboardController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Dashboard'),
    Controller(`/dashboard${endpoint ? `/${endpoint}` : ''}`),
  )
}

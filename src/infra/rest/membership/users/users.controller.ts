import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export function UsersController(endpoint?: string): ClassDecorator {
  return applyDecorators(
    ApiTags('Users'),
    Controller(`/membership/users${endpoint ? `${endpoint}` : ''}`),
  )
}

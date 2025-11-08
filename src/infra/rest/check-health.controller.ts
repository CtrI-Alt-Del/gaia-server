import { Controller, Get } from '@nestjs/common'

@Controller()
export class CheckHealthController {
  @Get('/health')
  async handle() {
    return { status: 'Gaia Server is healthy 🍃' }
  }
}

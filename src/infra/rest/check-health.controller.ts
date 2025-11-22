import { Controller, Get } from '@nestjs/common'
import { EnvProvider } from '../provision/env/env-provider'
import packageJson from '../../../package.json'

@Controller()
export class CheckHealthController {
  constructor(readonly envProvider: EnvProvider) {}

  @Get('/health')
  async handle() {
    const enviroment = this.envProvider.get('MODE')
    return {
      enviroment,
      version: packageJson.version,
      status: 'Gaia Server is healthy',
    }
  }
}

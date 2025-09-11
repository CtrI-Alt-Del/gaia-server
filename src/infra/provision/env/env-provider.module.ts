import { Module } from '@nestjs/common'

import { EnvProvider } from './env-provider'

@Module({
  providers: [EnvProvider],
  exports: [EnvProvider],
})
export class EnvProviderModule {}

import { Module } from '@nestjs/common'

import { DEPENDENCIES } from '@/infra/constants/dependencies'
import { EnvProviderModule } from '../env/env-provider.module'
import { DayjsDatetimeProvider } from './dayjs-datetime-provider'

@Module({
  imports: [EnvProviderModule],
  providers: [
    {
      provide: DEPENDENCIES.provision.datetimeProvider,
      useClass: DayjsDatetimeProvider,
    },
  ],
  exports: [DEPENDENCIES.provision.datetimeProvider],
})
export class DatetimeProviderModule {}

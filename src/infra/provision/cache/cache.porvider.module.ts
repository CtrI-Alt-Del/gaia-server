import { Module } from '@nestjs/common'

import { DEPENDENCIES } from '@/infra/constants/dependencies'
import { EnvProviderModule } from '../env/env-provider.module'
import { RedisCacheProvider } from './redis-cache-provider'

@Module({
  imports: [EnvProviderModule],
  providers: [
    {
      provide: DEPENDENCIES.provision.cacheProvider,
      useClass: RedisCacheProvider,
    },
  ],
  exports: [DEPENDENCIES.provision.cacheProvider],
})
export class CacheProviderModule {}

import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { EnvProviderModule } from '../provision/env/env-provider.module'
import { ClerkProvider } from './passport/clerk-provider'
import { ClerkStrategy } from './passport/clerk-strategy'

@Module({
  imports: [EnvProviderModule, PassportModule],
  providers: [ClerkProvider, ClerkStrategy],
  exports: [ClerkProvider],
})
export class AuthModule {}

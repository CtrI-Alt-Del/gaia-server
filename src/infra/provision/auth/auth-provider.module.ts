import { Module } from '@nestjs/common'
import { ClerkAuthProvider } from './clerk-auth-provider'
import { AuthModule } from '@/infra/auth/auth.module'
import { EnvProviderModule } from '../env/env-provider.module'

@Module({
  imports: [AuthModule, EnvProviderModule],
  providers: [
    {
      provide: AuthProviderModule.AUTH_PROVIDER,
      useClass: ClerkAuthProvider,
    },
  ],
  exports: [AuthProviderModule.AUTH_PROVIDER],
})
export class AuthProviderModule {
  static readonly AUTH_PROVIDER = 'AUTH_PROVIDER'
}

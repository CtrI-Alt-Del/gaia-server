import { Inject } from '@nestjs/common'
import { ClerkClient } from '@clerk/backend'
import { EnvProvider } from '../env/env-provider'

export class ClerkAuthProvider {
  constructor(
    @Inject('CLERK')
    private readonly clerk: ClerkClient,
    private readonly envProvider: EnvProvider,
  ) {}

  async createAccount(userId: string, userEmail: string) {
    try {
      await this.clerk.invitations.createInvitation({
        emailAddress: userEmail,
        redirectUrl: `${this.envProvider.get('PANEL_APP_URL')}/auth/sign-up`,
        publicMetadata: {
          userId,
        },
        expiresInDays: 7,
      })
    } catch (error) {
      console.error(error)
      throw new Error('Failed to create account')
    }
  }
}

import { Inject, Injectable } from '@nestjs/common'

import { AuthProvider } from '@/core/auth/interfaces'
import { EventPayload } from '@/core/global/domain/types/event-payload'
import { UserCreatedEvent } from '@/core/membership/domain/events/user-created-event'
import { AuthProviderModule } from '@/infra/provision/auth/auth-provider.module'

type Payload = EventPayload<typeof UserCreatedEvent>

@Injectable()
export class CreateAccountJob {
  constructor(
    @Inject(AuthProviderModule.AUTH_PROVIDER)
    private readonly authProvider: AuthProvider,
  ) {}

  async handle(payload: Payload) {
    await this.authProvider.createAccount(payload.userId, payload.userEmail)
  }
}

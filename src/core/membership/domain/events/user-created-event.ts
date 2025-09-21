import { Event } from '@/core/global/domain/abstracts'

type Payload = {
  userId: string
  userEmail: string
}

export class UserCreatedEvent extends Event<Payload> {
  static readonly _NAME = 'membership/user.created'

  constructor(readonly payload: Payload) {
    super(UserCreatedEvent._NAME, payload)
  }
}

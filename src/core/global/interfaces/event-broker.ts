import { Event } from '../domain/abstracts'

export interface EventBroker {
  publish(event: Event): Promise<void>
}

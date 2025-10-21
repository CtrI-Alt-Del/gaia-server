import { Event } from '../domain/abstracts'

export interface Broker {
  publish(event: Event): Promise<void>
}

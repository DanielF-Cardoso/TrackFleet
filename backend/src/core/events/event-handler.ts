import { DomainEvent } from './domain-event'

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>
}

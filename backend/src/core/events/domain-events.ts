import { DomainEvent } from './domain-event'
import { EventHandler } from './event-handler'

export class DomainEvents {
  private static handlers: Map<string, EventHandler<DomainEvent>[]> = new Map()
  private static markedEvents: DomainEvent[] = []

  public static register<T extends DomainEvent>(
    handler: EventHandler<T>,
    eventName: string,
  ): void {
    const handlers = this.handlers.get(eventName) || []
    handlers.push(handler as EventHandler<DomainEvent>)
    this.handlers.set(eventName, handlers)
  }

  public static markEventForDispatch(event: DomainEvent): void {
    this.markedEvents.push(event)
  }

  public static async dispatchEvents(): Promise<void> {
    const events = [...this.markedEvents]
    this.markedEvents = []

    for (const event of events) {
      const eventName = event.constructor.name
      const handlers = this.handlers.get(eventName) || []

      await Promise.all(handlers.map((handler) => handler.handle(event)))
    }
  }

  public static clearHandlers(): void {
    this.handlers.clear()
  }

  public static clearMarkedEvents(): void {
    this.markedEvents = []
  }
}

import { DomainEvent } from '@/core/events/domain-event'
import { Manager } from '../entities/manager.entity'

export class PasswordResetTokenCreatedEvent extends DomainEvent {
  constructor(
    private readonly manager: Manager,
    private readonly rawToken: string,
  ) {
    super()
  }

  getAggregateId(): string {
    return this.manager.id.toString()
  }

  get managerData(): Manager {
    return this.manager
  }

  get token(): string {
    return this.rawToken
  }
}

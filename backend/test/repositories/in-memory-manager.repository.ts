import { Email } from '@/core/value-objects/email.vo'
import { ManagerRepository } from '@/domain/manager/application/repositories/manager-repository'
import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'

export class InMemoryManagerRepository implements ManagerRepository {
  public items: Manager[] = []

  async create(manager: Manager) {
    this.items.push(manager)
    return manager
  }

  async findByEmail(email: string) {
    const emailVO = new Email(email)
    const manager = this.items.find(
      (item) => item.email.toValue() === emailVO.toValue(),
    )
    return manager || null
  }

  async findById(id: string) {
    const manager = this.items.find((item) => item.id.toValue() === id)
    return manager || null
  }
}

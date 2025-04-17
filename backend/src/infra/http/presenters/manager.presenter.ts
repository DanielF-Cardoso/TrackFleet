import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'

export class ManagerPresenter {
  static toHTTP(manager: Manager) {
    return {
      id: manager.id.toString(),
      firstName: manager.name.getFirstName(),
      lastName: manager.name.getLastName(),
      email: manager.email.toValue(),
      createdAt: manager.createdAt,
    }
  }
}

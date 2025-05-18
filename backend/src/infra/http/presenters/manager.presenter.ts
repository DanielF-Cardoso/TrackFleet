import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'

export class ManagerPresenter {
  static toHTTP(manager: Manager) {
    return {
      id: manager.id.toString(),
      firstName: manager.name.getFirstName(),
      lastName: manager.name.getLastName(),
      email: manager.email.toValue(),
      phone: manager.phone.toValue(),
      address: {
        street: manager.address.getStreet(),
        number: manager.address.getNumber(),
        district: manager.address.getDistrict(),
        zipCode: manager.address.getZipCode(),
        city: manager.address.getCity(),
        state: manager.address.getState(),
      },
      isActive: manager.isActive,
      lastLogin: manager.lastLogin,
      createdAt: manager.createdAt,
      updatedAt: manager.updatedAt,
      inactiveAt: manager.inactiveAt,
    }
  }
}

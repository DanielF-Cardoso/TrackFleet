import { Driver } from '@/domain/driver/enterprise/entities/driver.entity'

export class DriverPresenter {
  static toHTTP(driver: Driver) {
    return {
      id: driver.id.toString(),
      firstName: driver.name.getFirstName(),
      lastName: driver.name.getLastName(),
      email: driver.email.toValue(),
      phone: driver.phone.toValue(),
      cnh: driver.cnh.toValue(),
      cnhType: driver.cnhType,
      address: {
        street: driver.address.getStreet(),
        number: driver.address.getNumber(),
        district: driver.address.getDistrict(),
        zipCode: driver.address.getZipCode(),
        city: driver.address.getCity(),
        state: driver.address.getState(),
      },
      isActive: driver.isActive,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
      inactiveAt: driver.inactiveAt,
    }
  }
}

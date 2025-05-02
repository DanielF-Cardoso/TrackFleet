import { Cnh } from '@/core/value-objects/cnh.vo'
import { Email } from '@/core/value-objects/email.vo'
import { DriverRepository } from '@/domain/driver/application/repositories/driver-repository'
import { Driver } from '@/domain/driver/enterprise/entities/driver.entity'

export class InMemoryDriverRepository implements DriverRepository {
  public items: Driver[] = []

  async create(driver: Driver) {
    this.items.push(driver)
    return driver
  }

  async findByEmail(email: string) {
    const emailVO = new Email(email)
    const driver = this.items.find(
      (item) => item.email.toValue() === emailVO.toValue(),
    )
    return driver || null
  }

  async findById(id: string) {
    const driver = this.items.find((item) => item.id.toValue() === id)
    return driver || null
  }

  async findByCNH(cnh: string) {
    const cnhVO = new Cnh(cnh)
    const driver = this.items.find(
      (item) => item.cnh.toValue() === cnhVO.toValue(),
    )
    return driver || null
  }

  async save(driver: Driver): Promise<Driver> {
    const index = this.items.findIndex((item) => item.id.equals(driver.id))
    if (index >= 0) {
      this.items[index] = driver
    }
    return driver
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toValue() === id)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findAll(): Promise<Driver[]> {
    return this.items
  }
}

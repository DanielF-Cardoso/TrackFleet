import { Driver } from '../../enterprise/entities/driver.entity'

export abstract class DriverRepository {
  abstract findById(id: string): Promise<Driver | null>
  abstract findByEmail(email: string): Promise<Driver | null>
  abstract findByCNH(cnh: string): Promise<Driver | null>
  abstract findByPhone(phone: string): Promise<Driver | null>
  abstract create(driver: Driver): Promise<Driver>
  abstract save(driver: Driver): Promise<Driver>
  abstract delete(id: string): Promise<void>
  abstract findAll(): Promise<Driver[]>
}

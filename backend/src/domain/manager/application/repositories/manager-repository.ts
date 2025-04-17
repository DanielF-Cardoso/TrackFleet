import { Manager } from '../../enterprise/entities/manager.entity'

export abstract class ManagerRepository {
  abstract findById(id: string): Promise<Manager | null>
  abstract findByEmail(email: string): Promise<Manager | null>
  abstract create(manager: Manager): Promise<Manager>
  abstract save(manager: Manager): Promise<void>
  abstract findAll(): Promise<Manager[]>
}

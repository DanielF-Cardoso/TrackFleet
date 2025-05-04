import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/core/value-objects/address.vo'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'

export interface ManagerProps {
  name: Name
  email: Email
  password: string
  phone: string
  address: Address
  createdAt: Date
  updatedAt?: Date
}

export class Manager extends Entity<ManagerProps> {
  static create(props: Omit<ManagerProps, 'createdAt'>, id?: UniqueEntityID) {
    const now = new Date()
    const manager = new Manager(
      {
        ...props,
        createdAt: now,
        updatedAt: now,
      },
      id,
    )
    return manager
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword
    this.touch()
  }

  updateProfile({ name, email }: { name?: Name; email?: Email }) {
    if (name) {
      this.props.name = name
    }

    if (email) {
      this.props.email = email
    }

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}

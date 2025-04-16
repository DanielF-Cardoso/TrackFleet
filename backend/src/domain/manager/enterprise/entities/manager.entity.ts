import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Email } from 'src/core/value-objects/email.vo'

export interface ManagerProps {
  firstName: string
  lastName: string
  email: Email
  password: string
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

  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get email() {
    return this.props.email.toValue()
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

  private touch() {
    this.props.updatedAt = new Date()
  }
}

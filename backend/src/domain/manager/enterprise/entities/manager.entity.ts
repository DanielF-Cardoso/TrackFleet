import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/core/value-objects/address.vo'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Phone } from '@/core/value-objects/phone.vo'

export interface ManagerProps {
  name: Name
  email: Email
  password: string
  phone: Phone
  address: Address
  createdAt: Date
  updatedAt?: Date
  lastLogin?: Date
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

  get phone() {
    return this.props.phone
  }

  get address() {
    return this.props.address
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get lastLogin() {
    return this.props.lastLogin
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword
    this.touch()
  }

  updateLastLogin() {
    this.props.lastLogin = new Date()
  }

  updateProfile({
    name,
    email,
    phone,
    address,
  }: {
    name?: Name
    email?: Email
    phone?: Phone
    address?: Address
  }) {
    if (name) {
      this.props.name = name
    }

    if (email) {
      this.props.email = email
    }

    if (address) {
      this.props.address = address
    }

    if (phone) {
      this.props.phone = phone
    }

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}

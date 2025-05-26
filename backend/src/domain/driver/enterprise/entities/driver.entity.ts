import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/core/value-objects/address.vo'
import { Cnh } from '@/core/value-objects/cnh.vo'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Phone } from '@/core/value-objects/phone.vo'

export type CnhType = 'A' | 'B' | 'C' | 'D' | 'E'

export interface DriverProps {
  name: Name
  cnh: Cnh
  cnhType: CnhType
  email: Email
  phone: Phone
  address: Address
  isActive?: boolean
  createdAt: Date
  updatedAt?: Date
  inactiveAt?: Date
}

export class Driver extends Entity<DriverProps> {
  static create(props: Omit<DriverProps, 'createdAt'>, id?: UniqueEntityID) {
    const now = new Date()
    const driver = new Driver(
      {
        ...props,
        isActive: props.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      },
      id,
    )
    return driver
  }

  get name() {
    return this.props.name
  }

  get cnh() {
    return this.props.cnh
  }

  get cnhType() {
    return this.props.cnhType
  }

  get email() {
    return this.props.email
  }

  get phone() {
    return this.props.phone
  }

  get address() {
    return this.props.address
  }

  get isActive() {
    return this.props.isActive
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get inactiveAt() {
    return this.props.inactiveAt
  }

  updateProfile({
    name,
    email,
    phone,
    address,
    cnh,
    cnhType,
  }: {
    name?: Name
    email?: Email
    phone?: Phone
    address?: Address
    cnh?: Cnh
    cnhType?: CnhType
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
    if (cnh) {
      this.props.cnh = cnh
    }
    if (cnhType) {
      this.props.cnhType = cnhType
    }

    this.touch()
  }

  updatePhoneNumber(newPhone: Phone) {
    this.props.phone = newPhone
    this.touch()
  }

  inactivate() {
    this.props.isActive = false
    this.props.inactiveAt = new Date()
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}

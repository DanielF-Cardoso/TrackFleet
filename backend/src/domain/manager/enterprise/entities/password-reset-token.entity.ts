import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PasswordResetTokenProps {
  token: string
  managerId: UniqueEntityID
  expiresAt: Date
  usedAt?: Date | null
  createdAt: Date
}

export class PasswordResetToken extends Entity<PasswordResetTokenProps> {
  static create(
    props: Omit<PasswordResetTokenProps, 'createdAt'> & { createdAt?: Date },
    id?: UniqueEntityID,
  ) {
    const passwordResetToken = new PasswordResetToken(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return passwordResetToken
  }

  get token() {
    return this.props.token
  }

  get managerId() {
    return this.props.managerId
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get usedAt() {
    return this.props.usedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get isExpired() {
    return new Date() > this.expiresAt
  }

  get isUsed() {
    return !!this.usedAt
  }

  markAsUsed() {
    this.props.usedAt = new Date()
  }
}

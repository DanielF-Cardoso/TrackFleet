import { PasswordResetToken } from '../../enterprise/entities/password-reset-token.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class ManagerPasswordResetTokenRepository {
  abstract create(token: PasswordResetToken): Promise<void>
  abstract findByToken(token: string): Promise<PasswordResetToken | null>
  abstract findByManagerId(
    managerId: UniqueEntityID,
  ): Promise<PasswordResetToken | null>

  abstract save(token: PasswordResetToken): Promise<void>
}

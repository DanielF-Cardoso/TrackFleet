import { PasswordResetToken } from '@/domain/manager/enterprise/entities/password-reset-token.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaPasswordResetTokenMapper {
  static toPrisma(passwordResetToken: PasswordResetToken) {
    return {
      id: passwordResetToken.id.toString(),
      token: passwordResetToken.token,
      managerId: passwordResetToken.managerId.toString(),
      expiresAt: passwordResetToken.expiresAt,
      usedAt: passwordResetToken.usedAt,
      createdAt: passwordResetToken.createdAt,
    }
  }

  static toDomain(raw: any): PasswordResetToken {
    return PasswordResetToken.create(
      {
        token: raw.token,
        managerId: new UniqueEntityID(raw.managerId),
        expiresAt: raw.expiresAt,
        usedAt: raw.usedAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }
}

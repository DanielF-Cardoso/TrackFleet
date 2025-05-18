import { ManagerPasswordResetTokenRepository } from '@/domain/manager/application/repositories/manager-password-reset-token-repository'
import { PasswordResetToken } from '@/domain/manager/enterprise/entities/password-reset-token.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class InMemoryManagerPasswordResetTokenRepository
    implements ManagerPasswordResetTokenRepository {
    public items: PasswordResetToken[] = []

    async create(token: PasswordResetToken): Promise<void> {
        this.items.push(token)
    }

    async findByToken(token: string): Promise<PasswordResetToken | null> {
        const passwordResetToken = this.items.find(
            (item) => item.token === token,
        )

        if (!passwordResetToken) {
            return null
        }

        return passwordResetToken
    }

    async findByManagerId(
        managerId: UniqueEntityID,
    ): Promise<PasswordResetToken | null> {
        const passwordResetToken = this.items.find(
            (item) => item.managerId.equals(managerId),
        )

        if (!passwordResetToken) {
            return null
        }

        return passwordResetToken
    }

    async save(token: PasswordResetToken): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id.equals(token.id))

        if (itemIndex >= 0) {
            this.items[itemIndex] = token
        }
    }
} 
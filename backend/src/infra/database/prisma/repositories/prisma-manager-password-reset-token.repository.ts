import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ManagerPasswordResetTokenRepository } from '@/domain/manager/application/repositories/manager-password-reset-token-repository'
import { PasswordResetToken } from '@/domain/manager/enterprise/entities/password-reset-token.entity'
import { PrismaPasswordResetTokenMapper } from '../mappers/prisma-password-reset-token-mapper'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaManagerPasswordResetTokenRepository
  implements ManagerPasswordResetTokenRepository
{
  constructor(private prisma: PrismaService) {}

  async create(token: PasswordResetToken): Promise<void> {
    const data = PrismaPasswordResetTokenMapper.toPrisma(token)

    await this.prisma.passwordResetToken.create({
      data,
    })
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    })

    if (!passwordResetToken) {
      return null
    }

    return PrismaPasswordResetTokenMapper.toDomain(passwordResetToken)
  }

  async findByManagerId(
    managerId: UniqueEntityID,
  ): Promise<PasswordResetToken | null> {
    const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        managerId: managerId.toString(),
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!passwordResetToken) {
      return null
    }

    return PrismaPasswordResetTokenMapper.toDomain(passwordResetToken)
  }

  async save(token: PasswordResetToken): Promise<void> {
    const data = PrismaPasswordResetTokenMapper.toPrisma(token)

    await this.prisma.passwordResetToken.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}

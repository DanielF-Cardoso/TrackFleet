import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PasswordResetToken } from '@/domain/manager/enterprise/entities/password-reset-token.entity'

describe('Reset Password Controller (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    await app.init()

    managerFactory = moduleRef.get(ManagerFactory)
    prisma = moduleRef.get(PrismaService)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.passwordResetToken.deleteMany()
  })

  test('[POST] /api/v1/managers/reset-password – success', async () => {
    const manager = await managerFactory.makePrismaManager()

    const token = PasswordResetToken.create({
      token: 'valid-token',
      managerId: manager.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    })

    await prisma.passwordResetToken.create({
      data: {
        id: token.id.toString(),
        token: token.token,
        managerId: token.managerId.toString(),
        expiresAt: token.expiresAt,
        createdAt: token.createdAt,
      },
    })

    const result = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        token: 'valid-token',
        password: 'new-password123',
      })

    expect(result.status).toBe(201)
    expect(result.body.message).toBeTruthy()

    const updatedToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: 'valid-token',
      },
    })

    expect(updatedToken?.usedAt).toBeTruthy()
  })
})

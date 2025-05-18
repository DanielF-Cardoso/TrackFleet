import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Forgot Password Controller (E2E)', () => {
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

  test('[POST] /api/v1/managers/forgot-password – success', async () => {
    const manager = await managerFactory.makePrismaManager()

    const result = await request(app.getHttpServer())
      .post('/managers/forgot-password')
      .send({
        email: manager.email.toValue(),
      })

    expect(result.status).toBe(201)

    const token = await prisma.passwordResetToken.findFirst({
      where: {
        managerId: manager.id.toString(),
      },
    })

    expect(token).toBeTruthy()
    expect(token?.expiresAt).toBeTruthy()
    expect(token?.usedAt).toBeNull()
  })

  test('[POST] /api/v1/managers/forgot-password – should not allow requesting a new token within 1 minute', async () => {
    const manager = await managerFactory.makePrismaManager()

    await request(app.getHttpServer()).post('/managers/forgot-password').send({
      email: manager.email.toValue(),
    })

    const result = await request(app.getHttpServer())
      .post('/managers/forgot-password')
      .send({
        email: manager.email.toValue(),
      })

    expect(result.status).toBe(429)
  })
})

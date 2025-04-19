import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { hash } from 'bcryptjs'

describe('Authenticate Manager Controller (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory

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
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /api/v1/login', async () => {
    const email = 'test@test.com'
    const password = 'admin123'

    const manager = await managerFactory.makePrismaManager({
      email,
      password: await hash(password, 8),
    })

    const result = await request(app.getHttpServer())
      .post('/login')
      .send({ email: manager.email.toValue(), password })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      accessToken: expect.any(String),
    })
  })
})

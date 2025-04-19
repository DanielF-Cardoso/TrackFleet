import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'

describe('Get Manager Profile (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let jwt: JwtService

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
    jwt = moduleRef.get(JwtService)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /api/v1/managers/me – unauthorized without token', async () => {
    await request(app.getHttpServer()).get('/managers/me').expect(401)
  })

  test('[POST] /api/v1/managers/me – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const acessToken = jwt.sign({ sub: manager.id.toString() })

    const result = await request(app.getHttpServer())
      .get('/managers/me')
      .set('Authorization', `Bearer ${acessToken}`)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      manager: {
        id: manager.id.toString(),
        firstName: manager.name.getFirstName(),
        lastName: manager.name.getLastName(),
        email: manager.email.toValue(),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })
})

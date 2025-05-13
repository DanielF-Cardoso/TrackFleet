import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'

describe('Delete Manager Controller (E2E)', () => {
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

  test('[DELETE] /api/v1/managers – unauthorized without token', async () => {
    await request(app.getHttpServer()).get('/managers').expect(401)
  })

  test('[DELETE] /api/v1/managers – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const anotherManager = await managerFactory.makePrismaManager()
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    const result = await request(app.getHttpServer())
      .delete(`/managers/${anotherManager.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({})
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'

describe('Get Driver Profile (E2E)', () => {
  let app: INestApplication
  let driverFactory: DriverFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DriverFactory],
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

    driverFactory = moduleRef.get(DriverFactory)
    jwt = moduleRef.get(JwtService)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /api/v1/drivers/me – unauthorized without token', async () => {
    await request(app.getHttpServer()).get('/drivers/me').expect(401)
  })

  test('[POST] /api/v1/drivers/me – success', async () => {
    const driver = await driverFactory.makePrismaDriver()
    const acessToken = jwt.sign({ sub: driver.id.toString() })

    const result = await request(app.getHttpServer())
      .get('/drivers/me')
      .set('Authorization', `Bearer ${acessToken}`)

    expect(result.status).toBe(200)
  })
})

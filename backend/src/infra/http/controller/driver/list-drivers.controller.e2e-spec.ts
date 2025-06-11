import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { makeDriverInput } from 'test/factories/driver/make-driver-input'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'

describe('List Drivers Controller (E2E)', () => {
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

  test('[GET] /api/v1/drivers – unauthorized without token', async () => {
    await request(app.getHttpServer()).get('/drivers').expect(401)
  })

  test('[GET] /api/v1/drivers – success', async () => {
    const driver = await driverFactory.makePrismaDriver()

    const acessToken = jwt.sign({ sub: driver.id.toString() })

    makeDriverInput()

    const result = await request(app.getHttpServer())
      .get('/drivers')
      .set('Authorization', `Bearer ${acessToken}`)

    expect(result.status).toBe(200)

    expect(result.body.drivers.length).toBe(1)
  })
})

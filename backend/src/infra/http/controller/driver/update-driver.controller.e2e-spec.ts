import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'

describe('Update Driver Profile Controller (E2E)', () => {
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

  test('[PATCH] /api/v1/drivers/me – success', async () => {
    const driver = await driverFactory.makePrismaDriver()
    const accessToken = jwt.sign({ sub: driver.id.toString() })

    const updatedData = {
      firstName: 'UpdatedFirstName',
    }

    const result = await request(app.getHttpServer())
      .patch(`/drivers/me/${driver.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedData)

    console.log(result.body)
    expect(result.status).toBe(200)
  })
})

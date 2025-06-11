import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'
import { EventFactory } from 'test/factories/event/make-event-prisma'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'

describe('Inactivate Driver Controller (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let driverFactory: DriverFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, DriverFactory, EventFactory],
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
    driverFactory = moduleRef.get(DriverFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /drivers/inactivate/:driverId – unauthorized without token', async () => {
    await request(app.getHttpServer())
      .patch('/drivers/inactivate/any-id')
      .expect(401)
  })

  test('[PATCH] /drivers/inactivate/:driverId – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    const driver = await driverFactory.makePrismaDriver()

    const result = await request(app.getHttpServer())
      .patch(`/drivers/inactivate/${driver.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(204)
  })
})

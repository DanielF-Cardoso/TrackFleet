import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'
import { CarFactory } from 'test/factories/car/make-car-prisma'
import { EventFactory } from 'test/factories/event/make-event-prisma'

describe('Inactivate Car Controller (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let carFactory: CarFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CarFactory, EventFactory],
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
    carFactory = moduleRef.get(CarFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /cars/inactivate/:carId – unauthorized without token', async () => {
    await request(app.getHttpServer())
      .patch('/cars/inactivate/any-id')
      .expect(401)
  })

  test('[PATCH] /cars/inactivate/:carId – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    const car = await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
    })

    const result = await request(app.getHttpServer())
      .patch(`/cars/inactivate/${car.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(204)
  })
})

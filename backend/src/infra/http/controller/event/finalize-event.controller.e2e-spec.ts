import { AppModule } from '@/infra/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { CarFactory } from 'test/factories/car/make-car-prisma'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { EventFactory } from 'test/factories/event/make-event-prisma'
import { DatabaseModule } from '@/infra/database/prisma/database.module'

describe('Finalize Event Controller (E2E)', () => {
  let app: INestApplication
  let carFactory: CarFactory
  let driverFactory: DriverFactory
  let managerFactory: ManagerFactory
  let eventFactory: EventFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CarFactory, DriverFactory, ManagerFactory, EventFactory],
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

    carFactory = moduleRef.get(CarFactory)
    driverFactory = moduleRef.get(DriverFactory)
    managerFactory = moduleRef.get(ManagerFactory)
    eventFactory = moduleRef.get(EventFactory)
    jwt = moduleRef.get(JwtService)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /events/:id/finalize – unauthorized without token', async () => {
    await request(app.getHttpServer())
      .patch('/events/any-id/finalize')
      .send({ odometer: 1000 })
      .expect(401)
  })

  test('[PATCH] /events/:id/finalize – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const car = await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
      odometer: 1000,
    })
    const driver = await driverFactory.makePrismaDriver()
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    const event = await eventFactory.makePrismaEvent({
      carId: car.id.toString(),
      driverId: driver.id.toString(),
      managerId: manager.id.toString(),
      odometer: 1000,
      status: 'EXIT',
    })

    const result = await request(app.getHttpServer())
      .patch(`/events/${event.id.toString()}/finalize`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ odometer: 1050 })

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      event: expect.objectContaining({
        id: event.id.toString(),
        carId: car.id.toString(),
        driverId: driver.id.toString(),
        managerId: manager.id.toString(),
        odometer: 1050,
        status: 'ENTRY',
        endAt: expect.any(String),
      }),
    })
  })
}) 
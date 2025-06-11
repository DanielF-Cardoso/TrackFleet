import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { CarFactory } from 'test/factories/car/make-car-prisma'
import { EventFactory } from 'test/factories/event/make-event-prisma'
import { JwtService } from '@nestjs/jwt'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'

describe('ListUsedCarsByPeriodController (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let driverFactory: DriverFactory
  let carFactory: CarFactory
  let eventFactory: EventFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, DriverFactory, CarFactory, EventFactory],
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
    driverFactory = moduleRef.get(DriverFactory)
    carFactory = moduleRef.get(CarFactory)
    eventFactory = moduleRef.get(EventFactory)
    jwt = moduleRef.get(JwtService)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /events/used-cars-by-period – unauthorized without token', async () => {
    await request(app.getHttpServer())
      .get(
        '/events/used-cars-by-period?startDate=2025-06-01&endDate=2025-06-30',
      )
      .expect(401)
  })

  test('[GET] /events/used-cars-by-period – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const driver = await driverFactory.makePrismaDriver()
    const car = await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
    })
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    await eventFactory.makePrismaEvent({
      carId: car.id.toString(),
      driverId: driver.id.toString(),
      managerId: manager.id.toString(),
      startAt: new Date('2025-06-10'),
    })

    const result = await request(app.getHttpServer())
      .get(
        '/events/used-cars-by-period?startDate=2025-06-01&endDate=2025-06-30',
      )
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body.events.length).toBe(1)
    expect(result.body.events[0]).toEqual(
      expect.objectContaining({
        carId: car.id.toString(),
        driverId: driver.id.toString(),
        managerId: manager.id.toString(),
      }),
    )
  })
})

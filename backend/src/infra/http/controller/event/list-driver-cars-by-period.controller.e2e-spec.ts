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

describe('ListDriverCarsByPeriodController (E2E)', () => {
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

  test('[GET] /events/:driverId/cars-by-period – unauthorized without token', async () => {
    await request(app.getHttpServer())
      .get(
        '/events/any-driver/cars-by-period?startDate=2024-01-01&endDate=2024-01-31',
      )
      .expect(401)
  })

  test('[GET] /events/:driverId/cars-by-period – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const driver = await driverFactory.makePrismaDriver()
    const car1 = await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
      licensePlate: 'ABC-1234',
    })
    const car2 = await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
      licensePlate: 'XYZ-5678',
    })
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    await eventFactory.makePrismaEvent({
      carId: car1.id.toString(),
      driverId: driver.id.toString(),
      managerId: manager.id.toString(),
      startAt: new Date('2024-01-10'),
    })
    await eventFactory.makePrismaEvent({
      carId: car2.id.toString(),
      driverId: driver.id.toString(),
      managerId: manager.id.toString(),
      startAt: new Date('2024-01-15'),
    })

    const result = await request(app.getHttpServer())
      .get(
        `/events/${driver.id}/cars-by-period?startDate=2024-01-01&endDate=2024-01-31`,
      )
      .set('Authorization', `Bearer ${accessToken}`)

      console.log(result.body)

    expect(result.status).toBe(200)
    expect(result.body.cars.length).toBe(2)
    expect(result.body.cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: car1.id }),
        expect.objectContaining({ id: car2.id }),
      ]),
    )
  })
})

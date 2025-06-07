import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { CarFactory } from 'test/factories/car/make-car-prisma'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { makeEventInput } from 'test/factories/event/make-event-input'

describe('Create Event Controller (E2E)', () => {
  let app: INestApplication
  let carFactory: CarFactory
  let driverFactory: DriverFactory
  let managerFactory: ManagerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CarFactory, DriverFactory, ManagerFactory],
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
    jwt = moduleRef.get(JwtService)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /events – unauthorized without token', async () => {
    const createEventData = makeEventInput()

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventData)
      .expect(401)
  })

  test('[POST] /events – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const car = await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
    })
    const driver = await driverFactory.makePrismaDriver()
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    const createEventData = makeEventInput({
      carId: car.id.toString(),
      driverId: driver.id.toString(),
      odometer: car.odometer + 100, // Aumento válido na quilometragem
    })

    const result = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createEventData)

    expect(result.status).toBe(201)
    expect(result.body.event).toEqual({
      id: expect.any(String),
      carId: car.id.toString(),
      driverId: driver.id.toString(),
      managerId: manager.id.toString(),
      odometer: createEventData.odometer,
      status: 'EXIT',
      startAt: expect.any(String),
      endAt: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
}) 
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { CarFactory } from 'test/factories/car/make-car-prisma'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { EventFactory } from 'test/factories/event/make-event-prisma'

describe('Delete Event Controller (E2E)', () => {
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

  test('[DELETE] /events/:id – unauthorized without token', async () => {
    await request(app.getHttpServer())
      .delete('/events/any-id')
      .expect(401)
  })

  test('[DELETE] /events/:id – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const car = await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
      status: 'IN_USE',
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
      .delete(`/events/${event.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      event: expect.objectContaining({
        id: event.id.toString(),
        carId: car.id.toString(),
        driverId: driver.id.toString(),
        managerId: manager.id.toString(),
        odometer: 1000,
        status: 'EXIT',
      }),
    })

    // Verifica se o carro foi atualizado para AVAILABLE
    const updatedCar = await carFactory.prisma.car.findUnique({
      where: { id: car.id.toString() },
    })
    expect(updatedCar?.status).toBe('AVAILABLE')
  })
}) 
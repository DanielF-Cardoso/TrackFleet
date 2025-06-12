import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'
import { CarFactory } from 'test/factories/car/make-car-prisma'
describe('List Cars Controller (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let carFactory: CarFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CarFactory],
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

  test('[GET] /api/v1/cars – unauthorized without token', async () => {
    await request(app.getHttpServer()).get('/cars').expect(401)
  })

  test('[GET] /api/v1/cars – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    await carFactory.makePrismaCar({
      managerId: manager.id.toString(),
    })

    const result = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)

    expect(result.body).toEqual({
      cars: [
        {
          id: expect.any(String),
          managerId: expect.any(String),
          licensePlate: expect.any(String),
          brand: expect.any(String),
          model: expect.any(String),
          year: expect.any(Number),
          color: expect.any(String),
          odometer: expect.any(Number),
          status: expect.any(String),
          renavam: expect.any(String),
          isActive: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    })
    expect(result.body.cars.length).toBe(1)
  })
})

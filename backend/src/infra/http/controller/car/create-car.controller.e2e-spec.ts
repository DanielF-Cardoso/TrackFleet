import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CarFactory } from 'test/factories/car/make-car-prisma'
import { makeCarInput } from 'test/factories/car/make-car-input'
import { JwtService } from '@nestjs/jwt'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'

describe('Create Car Controller (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CarFactory, ManagerFactory],
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
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /api/v1/cars – unauthorized without token', async () => {
    const createCarData = makeCarInput()

    await request(app.getHttpServer())
      .post('/cars')
      .send(createCarData)
      .expect(401)
  })

  test('[POST] /api/v1/cars – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const accessToken = jwt.sign({ sub: manager.id.toString() })

    const { managerId, ...createCarData } = makeCarInput({
      managerId: manager.id.toString(),
    })

    const result = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createCarData)

    expect(result.status).toBe(201)
    expect(result.body.car).toEqual({
      id: expect.any(String),
      managerId: manager.id.toString(),
      licensePlate: createCarData.licensePlate,
      brand: createCarData.brand,
      model: createCarData.model,
      year: createCarData.year,
      color: createCarData.color,
      odometer: createCarData.odometer,
      status: 'AVAILABLE',
      renavam: createCarData.renavam,
      createdAt: expect.any(String),
    })
  })
})

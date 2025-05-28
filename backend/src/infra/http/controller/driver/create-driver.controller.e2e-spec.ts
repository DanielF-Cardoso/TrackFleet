import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeDriverInput } from 'test/factories/driver/make-driver-input'
import { JwtService } from '@nestjs/jwt'
import { DriverFactory } from 'test/factories/driver/make-manager-prisma'

describe('Create Driver Controller (E2E)', () => {
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

  test('[POST] /api/v1/drivers – unauthorized without token', async () => {
    const createDriverData = makeDriverInput()

    await request(app.getHttpServer())
      .post('/drivers')
      .send(createDriverData)
      .expect(401)
  })

  test('[POST] /api/v1/drivers – success', async () => {
    const driver = await driverFactory.makePrismaDriver()

    const acessToken = jwt.sign({ sub: driver.id.toString() })

    const createDriverData = makeDriverInput()

    const result = await request(app.getHttpServer())
      .post('/drivers')
      .set('Authorization', `Bearer ${acessToken}`)
      .send(createDriverData)

    expect(result.status).toBe(201)
    expect(result.body.driver).toEqual({
      id: expect.any(String),
      firstName: createDriverData.firstName,
      lastName: createDriverData.lastName,
      cnh: createDriverData.cnh,
      cnhType: createDriverData.cnhType,
      email: createDriverData.email,
      phone: createDriverData.phone,
      address: {
        street: createDriverData.street,
        number: createDriverData.number,
        district: createDriverData.district,
        zipCode: createDriverData.zipCode.replace('-', ''),
        city: createDriverData.city,
        state: createDriverData.state,
      },
      isActive: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})

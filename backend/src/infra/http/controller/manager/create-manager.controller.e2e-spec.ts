import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { makeManagerInput } from 'test/factories/manager/make-manager-input'
import { JwtService } from '@nestjs/jwt'

describe('Create Manager Controller (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory],
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

  test('[POST] /api/v1/managers – unauthorized without token', async () => {
    const createManagerData = makeManagerInput()

    await request(app.getHttpServer())
      .post('/managers')
      .send(createManagerData)
      .expect(401)
  })

  test('[POST] /api/v1/managers – success', async () => {
    const manager = await managerFactory.makePrismaManager()

    const acessToken = jwt.sign({ sub: manager.id.toString() })

    const createManagerData = makeManagerInput()

    const result = await request(app.getHttpServer())
      .post('/managers')
      .set('Authorization', `Bearer ${acessToken}`)
      .send(createManagerData)

    expect(result.status).toBe(201)
    expect(result.body.manager).toEqual({
      id: expect.any(String),
      firstName: createManagerData.firstName,
      lastName: createManagerData.lastName,
      email: createManagerData.email,
      phone: createManagerData.phone,
      address: {
        street: createManagerData.street,
        number: createManagerData.number,
        district: createManagerData.district,
        zipCode: createManagerData.zipCode.replace('-', ''),
        city: createManagerData.city,
        state: createManagerData.state,
      },
      isActive: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})

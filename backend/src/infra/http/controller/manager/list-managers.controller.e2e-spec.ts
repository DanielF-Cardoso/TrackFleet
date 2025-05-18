import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'

describe('List Managers Controller (E2E)', () => {
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

  test('[GET] /api/v1/managers – unauthorized without token', async () => {
    await request(app.getHttpServer()).get('/managers').expect(401)
  })

  test('[GET] /api/v1/managers – success', async () => {
    const manager = await managerFactory.makePrismaManager()
    const acessToken = jwt.sign({ sub: manager.id.toString() })

    const result = await request(app.getHttpServer())
      .get('/managers')
      .set('Authorization', `Bearer ${acessToken}`)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      managers: [
        {
          id: manager.id.toString(),
          firstName: manager.name.getFirstName(),
          lastName: manager.name.getLastName(),
          email: manager.email.toValue(),
          phone: manager.phone.toValue(),
          address: {
            street: manager.address.getStreet(),
            number: manager.address.getNumber(),
            district: manager.address.getDistrict(),
            zipCode: manager.address.getZipCode(),
            city: manager.address.getCity(),
            state: manager.address.getState(),
          },
          isActive: manager.isActive,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    })
    expect(result.body.managers.length).toBe(1)
  })
})

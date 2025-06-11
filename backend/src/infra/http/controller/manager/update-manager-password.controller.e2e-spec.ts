import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'bcryptjs'

describe('Update Manager Password Controller (E2E)', () => {
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

  test('[PATCH] /api/v1/managers/password – unauthorized without token', async () => {
    await request(app.getHttpServer()).patch('/managers/password').expect(401)
  })

  test('[PATCH] /api/v1/managers/password – success', async () => {
    const currentPassword = 'oldpassword123'
    const hashedPassword = await hash(currentPassword, 8)

    const manager = await managerFactory.makePrismaManager({
      password: hashedPassword,
    })

    const acessToken = jwt.sign({ sub: manager.id.toString() })

    const newPassword = 'newpassword123'

    const result = await request(app.getHttpServer())
      .patch('/managers/password')
      .set('Authorization', `Bearer ${acessToken}`)
      .send({ currentPassword, newPassword })

    expect(result.status).toBe(204)
  })
})

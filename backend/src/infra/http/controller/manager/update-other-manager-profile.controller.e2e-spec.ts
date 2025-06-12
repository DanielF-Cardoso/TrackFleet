import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/manager/make-manager-prisma'
import { JwtService } from '@nestjs/jwt'

describe('Update Other Manager Profile Controller (E2E)', () => {
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

    test('[PATCH] /api/v1/managers/:managerId – unauthorized without token', async () => {
        const manager = await managerFactory.makePrismaManager()
        await request(app.getHttpServer())
            .patch(`/managers/${manager.id}`)
            .send({})
            .expect(401)
    })

    test('[PATCH] /api/v1/managers/:managerId – success', async () => {
        const manager = await managerFactory.makePrismaManager()
        const accessToken = jwt.sign({ sub: 'admin-id' })

        const updatedData = {
            firstName: 'UpdatedFirstName',
            lastName: 'UpdatedLastName',
            email: 'updatedemail@example.com',
            phone: '11999999999',
            street: 'Updated Street',
            number: 123,
            district: 'Updated District',
            zipCode: '12345678',
            city: 'Updated City',
            state: 'US',
        }

        const result = await request(app.getHttpServer())
            .patch(`/managers/${manager.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedData)

        expect(result.status).toBe(200)

        expect(result.body).toEqual({
            manager: {
                id: manager.id.toString(),
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                email: updatedData.email,
                phone: updatedData.phone,
                address: {
                    street: updatedData.street,
                    number: updatedData.number,
                    district: updatedData.district,
                    zipCode: updatedData.zipCode,
                    city: updatedData.city,
                    state: updatedData.state,
                },
                isActive: true,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        })
    })
})

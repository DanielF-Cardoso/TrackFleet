import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'
import { CreateCarDto } from '@/infra/http/dto/car/create-car.dto'

export function CreateCarDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar um novo carro',
      description: 'Cria um novo carro no sistema.',
    }),
    ApiBody({
      description: 'Dados necessários para criar um carro.',
      type: CreateCarDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Carro criado com sucesso.',
      schema: {
        example: {
          car: {
            id: '39280a7e-215e-4f74-8893-6da161ac13e5',
            managerId: '751d7b0b-3782-47df-8403-88ea8840ee2c',
            licensePlate: 'ABC1234',
            brand: 'Toyota',
            model: 'Corolla',
            year: 2023,
            color: 'Black',
            odometer: 0,
            status: 'AVAILABLE',
            renavam: '12345678901',
            createdAt: '2024-03-20T10:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 409,
      description: 'O carro já existe.',
    }),
  )
}

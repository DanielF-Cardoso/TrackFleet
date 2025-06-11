import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger'
import { UpdateCarDTO } from '@/infra/http/dto/car/update-car.dto'

export function UpdateCarDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar carro',
      description: 'Atualiza os dados de um carro existente.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do carro a ser atualizado',
      type: String,
    }),
    ApiBody({
      description: 'Dados para atualização do carro',
      type: UpdateCarDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Carro atualizado com sucesso.',
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
            odometer: 10000,
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
      status: 404,
      description: 'Carro não encontrado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Placa ou Renavam já cadastrados.',
    }),
  )
}

import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger'

export function GetCarByLicensePlateDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar carro por placa',
      description: 'Retorna os dados de um carro a partir da placa.',
    }),
    ApiQuery({
      name: 'licensePlate',
      required: true,
      description: 'Placa do carro a ser buscado',
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'Carro encontrado com sucesso.',
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
      status: 404,
      description: 'Carro não encontrado.',
    }),
  )
}

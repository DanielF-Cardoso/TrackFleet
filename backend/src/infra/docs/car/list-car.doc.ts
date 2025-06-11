import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ListCarDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar carros',
      description: 'Retorna a lista de todos os carros cadastrados.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de carros retornada com sucesso.',
      schema: {
        example: {
          cars: [
            {
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
          ],
        },
      },
    }),
    ApiResponse({
      status: 204,
      description: 'Nenhum carro encontrado.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
  )
}

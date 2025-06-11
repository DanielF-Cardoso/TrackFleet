import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ListEventsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar eventos',
      description: 'Retorna a lista de todos os eventos cadastrados.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de eventos retornada com sucesso.',
      schema: {
        example: {
          events: [
            {
              id: 'e1a2c3d4-e5f6-7890-abcd-1234567890ef',
              carId: 'c1a2c3d4-e5f6-7890-abcd-1234567890ef',
              driverId: 'd1a2c3d4-e5f6-7890-abcd-1234567890ef',
              managerId: 'm1a2c3d4-e5f6-7890-abcd-1234567890ef',
              odometer: 10000,
              status: 'EXIT',
              startAt: '2024-03-20T10:00:00Z',
              endAt: null,
              createdAt: '2024-03-20T10:00:00Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 204,
      description: 'Nenhum evento encontrado.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro inesperado.',
    }),
  )
}

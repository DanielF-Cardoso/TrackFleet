import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'

export function ListUsedCarsByPeriodDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar eventos de carros usados em um período',
      description:
        'Retorna todos os eventos de uso de veículos registrados em um determinado intervalo de datas.',
    }),
    ApiQuery({
      name: 'startDate',
      required: true,
      type: String,
      example: '2025-06-01',
      description: 'Data inicial do período (YYYY-MM-DD)',
    }),
    ApiQuery({
      name: 'endDate',
      required: true,
      type: String,
      example: '2025-06-30',
      description: 'Data final do período (YYYY-MM-DD)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de eventos retornada com sucesso.',
      schema: {
        example: {
          events: [
            {
              id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
              carId: 'c1a2b3c4-d5e6-7890-abcd-1234567890ef',
              driverId: 'd1a2b3c4-d5e6-7890-abcd-1234567890ef',
              managerId: 'm1a2b3c4-d5e6-7890-abcd-1234567890ef',
              odometer: 12345,
              status: 'ENTRY',
              startAt: '2025-06-10T10:00:00Z',
              endAt: '2025-06-10T18:00:00Z',
              createdAt: '2025-06-10T09:00:00Z',
              updatedAt: '2025-06-10T18:00:00Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Nenhum evento encontrado no período.',
    }),
  )
}

import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'

export function ListDriverCarsByPeriodDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar carros usados por um motorista em um período',
      description:
        'Retorna todos os carros utilizados por um motorista em um determinado intervalo de datas.',
    }),
    ApiQuery({
      name: 'startDate',
      required: true,
      type: String,
      example: '2024-01-01',
      description: 'Data inicial do período (YYYY-MM-DD)',
    }),
    ApiQuery({
      name: 'endDate',
      required: true,
      type: String,
      example: '2024-01-31',
      description: 'Data final do período (YYYY-MM-DD)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de carros retornada com sucesso.',
      schema: {
        example: {
          cars: [
            {
              id: 'c1a2b3c4-d5e6-7890-abcd-1234567890ef',
              managerId: 'm1a2b3c4-d5e6-7890-abcd-1234567890ef',
              licensePlate: 'ABC1D23',
              brand: 'Fiat',
              model: 'Uno',
              year: 2022,
              color: 'Branco',
              odometer: 12345,
              status: 'IN_USE',
              renavam: '12345678901',
              createdAt: '2024-01-10T10:00:00Z',
              updatedAt: '2024-01-20T10:00:00Z',
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
      description: 'Nenhum carro encontrado para o motorista no período.',
    }),
  )
}

import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger'
import { FinalizeEventDTO } from '@/infra/http/dto/event/finalize-event.dto'

export function FinalizeEventDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finalizar evento',
      description:
        'Finaliza um evento de saída de veículo, registrando o odômetro de retorno.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do evento a ser finalizado',
      type: String,
    }),
    ApiBody({
      description: 'Dados para finalização do evento',
      type: FinalizeEventDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Evento finalizado com sucesso.',
      schema: {
        example: {
          event: {
            id: 'e1a2c3d4-e5f6-7890-abcd-1234567890ef',
            carId: 'c1a2c3d4-e5f6-7890-abcd-1234567890ef',
            driverId: 'd1a2c3d4-e5f6-7890-abcd-1234567890ef',
            managerId: 'm1a2c3d4-e5f6-7890-abcd-1234567890ef',
            odometer: 12000,
            status: 'ENTRY',
            startAt: '2024-03-20T10:00:00Z',
            endAt: '2024-03-21T18:00:00Z',
            createdAt: '2024-03-20T10:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Status inválido ou odômetro inconsistente.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Evento ou carro não encontrado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro inesperado.',
    }),
  )
}

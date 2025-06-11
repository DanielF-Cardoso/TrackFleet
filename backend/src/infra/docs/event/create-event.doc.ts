import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { CreateEventDTO } from '@/infra/http/dto/event/create-event.dto'

export function CreateEventDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar evento',
      description: 'Cria um novo evento de saída de veículo.',
    }),
    ApiBody({
      description: 'Dados necessários para criar um evento.',
      type: CreateEventDTO,
    }),
    ApiResponse({
      status: 201,
      description: 'Evento criado com sucesso.',
      schema: {
        example: {
          event: {
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
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou inconsistentes.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Carro ou motorista não encontrado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Carro já está em uso.',
    }),
  )
}

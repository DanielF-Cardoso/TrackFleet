import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function GetDriverProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter perfil do motorista',
      description: 'Retorna os dados do motorista.',
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil do motorista retornado com sucesso.',
      schema: {
        example: {
          driver: {
            id: 'b1a2c3d4-e5f6-7890-abcd-1234567890ef',
            firstName: 'João',
            lastName: 'Silva',
            email: 'joao.silva@email.com',
            cnh: '12345678900',
            cnhType: 'B',
            phone: '11999999999',
            address: {
              street: 'Rua Exemplo',
              number: 123,
              district: 'Centro',
              zipCode: '12345-678',
              city: 'São Paulo',
              state: 'SP',
            },
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
      description: 'Motorista não encontrado.',
    }),
  )
}

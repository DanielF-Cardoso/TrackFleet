import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ListDriversDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar motoristas',
      description: 'Retorna a lista de todos os motoristas cadastrados.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de motoristas retornada com sucesso.',
      schema: {
        example: {
          drivers: [
            {
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
          ],
        },
      },
    }),
    ApiResponse({
      status: 204,
      description: 'Nenhum motorista encontrado.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
  )
}

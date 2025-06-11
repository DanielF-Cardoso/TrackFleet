import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ListManagersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar gestores',
      description: 'Retorna a lista de todos os gestores cadastrados.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de gestores retornada com sucesso.',
      schema: {
        example: {
          managers: [
            {
              id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
              firstName: 'Maria',
              lastName: 'Oliveira',
              email: 'maria.oliveira@email.com',
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
      status: 404,
      description: 'Nenhum gestor encontrado.',
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

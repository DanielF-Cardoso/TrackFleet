import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger'
import { UpdateDriverDTO } from '@/infra/http/dto/driver/update-driver.dto'

export function UpdateDriverDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar motorista',
      description: 'Atualiza os dados de um motorista existente.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do motorista a ser atualizado',
      type: String,
    }),
    ApiBody({
      description: 'Dados para atualização do motorista',
      type: UpdateDriverDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Motorista atualizado com sucesso.',
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
    ApiResponse({
      status: 409,
      description: 'Email, telefone ou CNH já cadastrados ou iguais ao atual.',
    }),
  )
}

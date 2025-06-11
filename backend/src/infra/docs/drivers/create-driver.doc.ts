import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { CreateDriverDTO } from '@/infra/http/dto/driver/create-driver.dto'

export function CreateDriverDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar motorista',
      description: 'Cria um novo motorista no sistema.',
    }),
    ApiBody({
      description: 'Dados necessários para criar um motorista.',
      type: CreateDriverDTO,
    }),
    ApiResponse({
      status: 201,
      description: 'Motorista criado com sucesso.',
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
      status: 409,
      description: 'Email, telefone ou CNH já cadastrados.',
    }),
  )
}

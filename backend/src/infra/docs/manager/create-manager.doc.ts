import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { CreateManagerDTO } from '@/infra/http/dto/manager/create-manager.dto'

export function CreateManagerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar gestor',
      description: 'Cria um novo gestor no sistema.',
    }),
    ApiBody({
      description: 'Dados necessários para criar um gestor.',
      type: CreateManagerDTO,
    }),
    ApiResponse({
      status: 201,
      description: 'Gestor criado com sucesso.',
      schema: {
        example: {
          manager: {
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
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Email ou telefone já cadastrados.',
    }),
  )
}

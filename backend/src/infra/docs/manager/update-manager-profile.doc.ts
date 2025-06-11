import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { UpdateManagerProfileDTO } from '@/infra/http/dto/manager/update-manager-profile.dto'

export function UpdateManagerProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar perfil do gestor autenticado',
      description:
        'Permite que o gestor autenticado atualize seus próprios dados cadastrais.',
    }),
    ApiBody({
      description: 'Dados para atualização do perfil do gestor',
      type: UpdateManagerProfileDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil do gestor atualizado com sucesso.',
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
      status: 404,
      description: 'Gestor não encontrado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Email ou telefone já cadastrados ou iguais ao atual.',
    }),
  )
}

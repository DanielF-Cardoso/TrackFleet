import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

export function InactivateManagerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Inativar gestor',
      description:
        'Inativa um gestor do sistema. Não é permitido inativar o próprio usuário ou o último gestor ativo.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do gestor a ser inativado',
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'Gestor inativado com sucesso.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 403,
      description:
        'Não é permitido inativar o próprio usuário ou o último gestor.',
    }),
    ApiResponse({
      status: 404,
      description: 'Gestor não encontrado.',
    }),
  )
}

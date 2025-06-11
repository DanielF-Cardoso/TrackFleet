import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { UpdateManagerPasswordDTO } from '@/infra/http/dto/manager/update-manager-password.dto'

export function UpdateManagerPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar senha do gestor',
      description: 'Permite que o gestor autenticado atualize sua senha.',
    }),
    ApiBody({
      description: 'Senha atual e nova senha.',
      type: UpdateManagerPasswordDTO,
    }),
    ApiResponse({
      status: 204,
      description: 'Senha atualizada com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description: 'Senha atual inválida.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 409,
      description: 'A nova senha não pode ser igual à anterior.',
    }),
    ApiResponse({
      status: 404,
      description: 'Gestor não encontrado.',
    }),
  )
}

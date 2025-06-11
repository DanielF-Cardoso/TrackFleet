import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

export function DeleteEventDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deletar evento',
      description:
        'Remove um evento do sistema. Só é permitido deletar eventos não finalizados.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do evento a ser deletado',
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'Evento deletado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description: 'Não é possível deletar um evento finalizado.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Evento não encontrado.',
    }),
  )
}

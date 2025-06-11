import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export function DeleteCarDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deletar um carro',
      description: 'Delete um novo carro no sistema.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do carro a ser deletado',
      type: String,
    }),
    ApiResponse({
      status: 204,
      description: 'Carro deletado com sucesso.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Carro não encontrado.',
    }),
  )
}

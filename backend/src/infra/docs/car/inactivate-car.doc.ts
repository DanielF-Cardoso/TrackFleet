import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

export function InactivateCarDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Inativar um carro',
      description:
        'Inativa um carro no sistema, tornando-o indisponível para uso.',
    }),
    ApiResponse({
      status: 200,
      description: 'Carro inativado com sucesso',
    }),
    ApiResponse({
      status: 404,
      description: 'Carro não encontrado',
    }),
    ApiResponse({
      status: 409,
      description: 'Carro possui eventos ativos e não pode ser inativado',
    }),
  )
}

import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

export function InactivateDriverDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Inativar um motorista',
      description:
        'Inativa um motorista no sistema, tornando-o indisponível para uso.',
    }),
    ApiResponse({
      status: 200,
      description: 'Motorista inativado com sucesso',
    }),
    ApiResponse({
      status: 404,
      description: 'Motorista não encontrado',
    }),
    ApiResponse({
      status: 409,
      description: 'Motorista possui eventos ativos e não pode ser inativado',
    }),
  )
}

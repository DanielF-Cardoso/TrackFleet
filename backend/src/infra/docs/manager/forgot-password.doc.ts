import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { ForgotPasswordDTO } from '@/infra/http/dto/manager/forgot-password.dto'

export function ForgotPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Solicitar recuperação de senha',
      description: 'Envia um email com link para recuperação de senha.',
    }),
    ApiBody({
      description: 'Email do gestor para recuperação de senha.',
      type: ForgotPasswordDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Email de recuperação enviado com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Gestor não encontrado.',
    }),
    ApiResponse({
      status: 429,
      description: 'Muitas solicitações. Aguarde antes de tentar novamente.',
    }),
  )
}

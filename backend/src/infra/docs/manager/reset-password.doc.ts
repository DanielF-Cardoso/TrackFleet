import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { ResetPasswordDTO } from '@/infra/http/dto/manager/reset-password.dto'

export function ResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resetar senha do gestor',
      description:
        'Permite redefinir a senha do gestor utilizando um token de recuperação.',
    }),
    ApiBody({
      description: 'Token de recuperação e nova senha.',
      type: ResetPasswordDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Senha redefinida com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description: 'Token inválido.',
    }),
  )
}

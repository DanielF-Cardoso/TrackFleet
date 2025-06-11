import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { AuthenticateManagerDTO } from '@/infra/http/dto/manager/authenticate-manager.dto'

export function AuthenticateManagerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Autenticar gestor',
      description: 'Realiza o login do gestor e retorna o token de acesso.',
    }),
    ApiBody({
      description: 'Credenciais do gestor',
      type: AuthenticateManagerDTO,
    }),
    ApiResponse({
      status: 201,
      description: 'Autenticação realizada com sucesso.',
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Credenciais inválidas.',
    }),
    ApiResponse({
      status: 401,
      description: 'Gestor inativo.',
    }),
  )
}

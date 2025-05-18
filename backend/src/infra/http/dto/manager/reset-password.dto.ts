import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MinLength } from 'class-validator'

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'Token Recebido no email',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  token!: string

  @ApiProperty({
    description: 'Nova senha',
    example: 'senha123564',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string
}

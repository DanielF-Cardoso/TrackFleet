import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class AuthenticateManagerDTO {
  @ApiProperty({
    description: 'O endereço de e-mail do gestor.',
    example: 'manager@example.com',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @IsEmail(undefined, {
    message: i18nValidationMessage('validation.isNotEmail'),
  })
  email!: string

  @ApiProperty({
    description: 'A senha do gestor.',
    example: 'senhaSegura123',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  password!: string
}

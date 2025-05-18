import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class ForgotPasswordDTO {
  @ApiProperty({
    description: 'O endereço de e-mail do gestor.',
    example: 'john.doe@example.com',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsEmail(undefined, {
    message: i18nValidationMessage('validation.isNotEmail'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  email!: string
}

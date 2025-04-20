import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class UpdateManagerPasswordDTO {
  @ApiProperty({
    description: 'A senha atual do gestor. Deve ter pelo menos 6 caracteres.',
    example: 'senhaSegura123',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.minLength'),
  })
  currentPassword!: string

  @ApiProperty({
    description: 'A nova senha do gestor. Deve ter pelo menos 6 caracteres.',
    example: 'novaSenhaSegura123',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.minLength'),
  })
  newPassword!: string
}

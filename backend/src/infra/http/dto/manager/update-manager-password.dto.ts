import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class UpdateManagerPasswordDTO {
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.minLength'),
  })
  currentPassword!: string

  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.minLength'),
  })
  newPassword!: string
}

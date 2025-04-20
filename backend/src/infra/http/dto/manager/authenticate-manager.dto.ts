import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class AuthenticateManagerDTO {
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @IsEmail(undefined, {
    message: i18nValidationMessage('validation.isNotEmail'),
  })
  email!: string

  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  password!: string
}

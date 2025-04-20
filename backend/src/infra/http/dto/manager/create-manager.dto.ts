import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class CreateManagerDTO {
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  firstName!: string

  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  lastName!: string

  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsEmail(undefined, {
    message: i18nValidationMessage('validation.isNotEmail'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  email!: string

  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.minLength'),
  })
  password!: string
}

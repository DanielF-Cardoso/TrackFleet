import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class UpdateManagerProfileDTO {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  firstName?: string

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  lastName?: string

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsEmail(undefined, {
    message: i18nValidationMessage('validation.isNotEmail'),
  })
  email?: string
}

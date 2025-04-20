import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class UpdateManagerProfileDTO {
  @ApiProperty({
    description: 'O primeiro nome do gestor.',
    example: 'John',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  firstName?: string

  @ApiProperty({
    description: 'O sobrenome do gestor.',
    example: 'Doe',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  lastName?: string

  @ApiProperty({
    description: 'O endereço de e-mail do gestor.',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsEmail(undefined, {
    message: i18nValidationMessage('validation.isNotEmail'),
  })
  email?: string
}

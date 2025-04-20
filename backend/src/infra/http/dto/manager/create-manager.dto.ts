import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class CreateManagerDTO {
  @ApiProperty({
    description: 'O primeiro nome do gestor.',
    example: 'John',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  firstName!: string

  @ApiProperty({
    description: 'O sobrenome do gestor.',
    example: 'Doe',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  lastName!: string

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

  @ApiProperty({
    description: 'A senha do gestor. Deve ter pelo menos 6 caracteres.',
    example: 'senhaSegura123',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.minLength'),
  })
  password!: string
}

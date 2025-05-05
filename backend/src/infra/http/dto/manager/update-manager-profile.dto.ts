import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
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

  @ApiProperty({
    description: 'A rua do endereço do gestor.',
    example: 'Rua das Flores',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  street?: string

  @ApiProperty({
    description: 'O número do endereço do gestor.',
    example: 123,
  })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.isNotNumber') })
  number?: number

  @ApiProperty({
    description: 'O bairro do endereço do gestor.',
    example: 'Centro',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  district?: string

  @ApiProperty({
    description: 'O CEP do endereço do gestor.',
    example: '12345678',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  zipCode?: string

  @ApiProperty({
    description: 'A cidade do endereço do gestor.',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  city?: string

  @ApiProperty({
    description: 'O estado do endereço do gestor.',
    example: 'SP',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  state?: string

  @ApiProperty({
    description: 'O número de telefone do gestor.',
    example: '11999999999',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @Matches(/^[1-9][0-9][2-9][0-9]{8}$/, {
    message: i18nValidationMessage('validation.isNotMobilePhone'),
  })
  phone?: string
}

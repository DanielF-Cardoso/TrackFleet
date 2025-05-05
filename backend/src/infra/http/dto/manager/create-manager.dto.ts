import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  Matches,
} from 'class-validator'
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

  @ApiProperty({
    description: 'O número de telefone do gestor (apenas números, com DDD).',
    example: '11999999999',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  @Matches(/^[1-9][0-9][2-9][0-9]{8}$/, {
    message: i18nValidationMessage('validation.isNotMobilePhone'),
  })
  phone!: string

  @ApiProperty({
    description: 'A rua do endereço do gestor.',
    example: 'Rua das Flores',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  street!: string

  @ApiProperty({
    description: 'O número do endereço do gestor.',
    example: 123,
  })
  @IsNumber({}, { message: i18nValidationMessage('validation.isNotNumber') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  number!: number

  @ApiProperty({
    description: 'O bairro do endereço do gestor.',
    example: 'Centro',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  district!: string

  @ApiProperty({
    description: 'O CEP do endereço do gestor.',
    example: '12345678',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  zipCode!: string

  @ApiProperty({
    description: 'A cidade do endereço do gestor.',
    example: 'São Paulo',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  city!: string

  @ApiProperty({
    description: 'O estado do endereço do gestor.',
    example: 'SP',
  })
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isEmpty') })
  state!: string
}

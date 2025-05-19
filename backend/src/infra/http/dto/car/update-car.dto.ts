import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class UpdateCarDTO {
  @ApiProperty({
    description: 'A marca do carro.',
    example: 'Honda',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  brand?: string

  @ApiProperty({
    description: 'O modelo do carro.',
    example: 'Civic',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  @MinLength(2, {
    message: i18nValidationMessage('validation.minLength'),
  })
  model?: string

  @ApiProperty({
    description: 'O ano do carro.',
    example: 2020,
  })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.isNotNumber') })
  year?: number

  @ApiProperty({
    description: 'A cor do carro.',
    example: 'Branco',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  color?: string

  @ApiProperty({
    description: 'A placa do carro.',
    example: 'ABC1D23',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  licensePlate?: string

  @ApiProperty({
    description: 'A quilometragem do carro.',
    example: 10000,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  odometer?: number

  @ApiProperty({
    description: 'O RENAVAM do carro.',
    example: '12345678900',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isNotString') })
  renavam?: string
}

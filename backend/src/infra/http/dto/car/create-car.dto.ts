import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class CreateCarDto {
  @ApiProperty({
    description: 'Marca do veiculo',
    example: 'Toyota',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  brand!: string

  @ApiProperty({
    description: 'Modelo do veiculo',
    example: 'Corolla',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  model!: string

  @ApiProperty({
    description: 'Ano do veiculo',
    example: 2020,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.isNumber'),
    },
  )
  @Min(1900, {
    message: i18nValidationMessage('validation.min'),
  })
  year!: number

  @ApiProperty({
    description: 'Cor do veiculo',
    example: 'Vermelho',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  color!: string

  @ApiProperty({
    description: 'Placa do veiculo',
    example: 'JOU4221',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  // Accepts two license plate formats:
  // 1. Old standard: ABC1234 (3 letters + 4 numbers)
  // 2. Mercosul standard: BRA1A23 (3 letters + 1 number + 1 letter/number + 2 numbers)
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/, {
    message: i18nValidationMessage('validation.isNotLicensePlate'),
  })
  licensePlate!: string

  @ApiProperty({
    description: 'Quilometragem do veiculo',
    example: 20000,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.isNumber'),
    },
  )
  odometer!: number

  @ApiProperty({
    description: 'Renavam do veiculo',
    example: '12345678900',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  @Matches(/^[0-9]{11}$/, {
    // 11 digits
    message: i18nValidationMessage('validation.isNotRenavam'),
  })
  renavam!: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateEventDTO {
  @ApiProperty({
    description: 'ID do carro',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  carId!: string

  @ApiProperty({
    description: 'ID do motorista',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  driverId!: string

  @ApiProperty({
    description: 'Quilometragem atual do veículo',
    example: 150000,
  })
  @IsNumber()
  @IsNotEmpty()
  odometer!: number
} 
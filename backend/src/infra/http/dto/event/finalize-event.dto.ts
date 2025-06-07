import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class FinalizeEventDTO {
  @ApiProperty({
    description: 'Quilometragem atual do veículo',
    example: 150000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  odometer!: number
} 
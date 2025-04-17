import { IsNotEmpty, MinLength } from 'class-validator'

export class UpdateManagerPasswordDTO {
  @IsNotEmpty()
  currentPassword!: string

  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string
}

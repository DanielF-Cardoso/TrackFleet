import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateManagerDTO {
  @IsNotEmpty()
  @MinLength(2)
  firstName!: string

  @IsNotEmpty()
  @MinLength(2)
  lastName!: string

  @IsEmail()
  email!: string

  @MinLength(6)
  password!: string
}

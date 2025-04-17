import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateManagerBody {
  @IsNotEmpty()
  firstName!: string

  @IsNotEmpty()
  lastName!: string

  @IsEmail()
  email!: string

  @MinLength(6)
  password!: string
}

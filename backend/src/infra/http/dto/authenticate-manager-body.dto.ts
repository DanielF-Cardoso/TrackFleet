import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthenticateManagerDTO {
  @IsEmail()
  email!: string

  @IsNotEmpty()
  password!: string
}

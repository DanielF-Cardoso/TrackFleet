import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateManagerProfileDTO {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string

  @IsOptional()
  @IsEmail()
  email?: string
}

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(10)
  @IsString()
  @IsNotEmpty({ message: 'login is required' })
  login: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  password: string;
}

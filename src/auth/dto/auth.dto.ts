import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(3, 12)
  password: string;
}

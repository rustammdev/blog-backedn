import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Length(3, 12)
  password: string;
}

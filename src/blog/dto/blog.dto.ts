import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  content: string;
}

import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBlogPostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @Length(50, 200)
  summary: string;
}

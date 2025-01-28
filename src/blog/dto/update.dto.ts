import { IsOptional, Length } from 'class-validator';

export class updateBlogPostDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  @Length(50, 200)
  summary?: string;
}

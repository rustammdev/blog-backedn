import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api/v1/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // create post
  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async createBlogPost(
    @Body(new ValidationPipe()) payload: CreateBlogPostDto,
    @Req()
    req: Request,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User authenticated');
    }
    return await this.blogService.create(payload, userId);
  }

  // get all posts
  @Get('')
  async getAllPosts(@Query()) {
    return await this.blogService.getAll();
  }
}

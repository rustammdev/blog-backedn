import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { updateBlogPostDto } from './dto/update.dto';

@Controller('api/v1/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // get all posts
  // GET /posts?page=2&limit=5
  @Get('/')
  async getAllPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    page = Number(page);
    limit = Number(limit);
    return await this.blogService.getAll(page, limit);
  }

  // get post by id
  @Get('/user')
  @UseGuards(AuthGuard('jwt'))
  async getPostByUserId(@Req() req: Request) {
    const userId = req.user?.id;
    return await this.blogService.getByUserId(userId);
  }

  // get post by id
  @Get('/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return await this.blogService.getById(id);
  }

  // create post
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async createBlogPost(
    @Body(new ValidationPipe()) payload: CreateBlogPostDto,
    @Req()
    req: Request,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.blogService.create(payload, userId);
  }

  // delete post
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async delPostById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const userId = req.user?.id;

    if (!userId) throw new UnauthorizedException();
    return await this.blogService.delPostById(id, userId);
  }

  // update post
  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updatePostById(
    @Body() payload: updateBlogPostDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const userId = req.user?.id;

    if (!userId) throw new UnauthorizedException();
    return await this.blogService.updateById(payload, id, userId);
  }
}

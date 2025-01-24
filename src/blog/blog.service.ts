import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogPostDto } from './dto/blog.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // create post
  async create(payload: CreateBlogPostDto, id: number) {
    try {
      const data: Prisma.PostCreateInput = {
        author: { connect: { id } },
        title: payload.title,
        content: payload.content,
      };
      const post = await this.prisma.post.create({ data });

      return {
        message: 'Post created',
        postId: post.id,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get all posts
  async getAll(page: number, limit: number) {
    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: page,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: { select: { username: true } },
      },
    });
  }
}

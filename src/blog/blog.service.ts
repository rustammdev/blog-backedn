import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create.dto';
import { Prisma } from '@prisma/client';
import { updateBlogPostDto } from './dto/update.dto';

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
        summary: payload.summary,
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
    // Parametrlarni tekshirish va hisoblash
    const offset = (page - 1) * limit;

    // Postlarni olish
    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        summary: true,
        author: { select: { username: true } },
      },
    });

    // Jami postlarni hisoblash
    const totalPosts = await this.prisma.post.count();

    // Natija qaytarish
    return {
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      data: posts,
    };
  }

  // get post by id
  async getById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        author: { select: { username: true } },
        title: true,
        summary: true,
        content: true,
        createdAt: true,
        id: true,
      },
    });

    if (!post) throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);

    return post;
  }

  async delPostById(postId: number, userId: number) {
    try {
      const post = await this.copywrite(postId, userId);

      // O'chirish
      await this.prisma.post.delete({
        where: { id: postId },
      });

      return {
        message: 'Post successfully deleted.',
        postId,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting post.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update post by Id
  async updateById(payload: updateBlogPostDto, postId: number, userId: number) {
    try {
      const post = await this.copywrite(postId, userId);

      // O'chirish
      await this.prisma.post.update({
        where: { id: postId },
        data: payload,
      });

      return {
        message: 'Post successfully updated.',
        postId,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating post.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async copywrite(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    // Agar post topilmasa
    if (!post) {
      throw new NotFoundException(
        'Post not found or you do not have permission.',
      );
    }

    return post;
  }
}

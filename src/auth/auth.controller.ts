import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { Request } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  // get all user
  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return await this.authservice.getAll();
  }

  // login user
  @Post('/login')
  async userLogin(@Body(new ValidationPipe()) payload: AuthDto) {
    return await this.authservice.validateUser(payload);
  }

  // register user
  @Post('/register')
  async userRegister(@Body(new ValidationPipe()) payload: AuthDto) {
    return await this.authservice.register(payload);
  }

  // delete user
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async userDelete(@Body(new ValidationPipe()) username: string) {
    return await this.authservice.delete(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@Req() req: Request) {
    console.log('Inside AuthController status method');
    return req.user;
  }
}

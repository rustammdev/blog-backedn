import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { DeleteUserDto } from './dto/email.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  // get all user
  @Get('')
  async getAll() {
    return await this.authservice.getAll();
  }

  // login user
  @Post('/login')
  async userLogin(@Body(new ValidationPipe()) payload: AuthDto) {
    return await this.authservice.validationUser(payload);
  }

  // register user
  @Post('/register')
  async userRegister(@Body(new ValidationPipe()) payload: AuthDto) {
    return await this.authservice.register(payload);
  }

  // delete user
  @Delete('/delete')
  async userDelete(@Body(new ValidationPipe()) { email }: DeleteUserDto) {
    return await this.authservice.delete(email);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DeleteUserDto } from './dto/email.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // login user
  async validationUser({ email, password }: AuthDto) {
    const findUser = await this.findUser(email);
    const isMatch = await bcrypt.compare(password, findUser.password);

    // check password
    if (!isMatch)
      throw new HttpException('Incorrent password.', HttpStatus.UNAUTHORIZED);

    const { password: _, ...user } = findUser;
    const token = this.jwtService.sign(user);
    return { accessToken: token };
  }

  // register user
  async register({ password, email }: AuthDto) {
    const findUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    // check user exists
    if (findUser)
      throw new HttpException('User alredy exist.', HttpStatus.CONFLICT);

    try {
      const hash = await bcrypt.hash(password, 10);
      const createUser = await this.prisma.user.create({
        data: { email, password: hash },
      });

      const { password: _, ...user } = createUser;
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // delete user
  async delete(email: string) {
    await this.findUser(email);

    return await this.prisma.user.delete({ where: { email } });
  }

  // find user
  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    // check user exists
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    return user;
  }

  // get all
  async getAll() {
    return await this.prisma.user.findMany();
  }
}

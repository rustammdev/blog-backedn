import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // login user
  async validateUser({ username, password }: AuthDto) {
    const findUser = await this.findUser(username);
    const isMatch = await bcrypt.compare(password, findUser.password);

    // check password
    if (!isMatch)
      throw new HttpException('Incorrent password.', HttpStatus.UNAUTHORIZED);

    const { password: _, ...user } = findUser;
    const token = this.jwtService.sign(user);
    return { accessToken: token };
  }

  // register user
  async register({ password, username }: AuthDto) {
    const findUser = await this.prisma.user.findUnique({
      where: { username },
    });

    // check user exists
    if (findUser)
      throw new HttpException('User alredy exist.', HttpStatus.CONFLICT);

    try {
      const hash = await bcrypt.hash(password, 10);
      const createUser = await this.prisma.user.create({
        data: { username, password: hash },
      });

      const { password: _, ...user } = createUser;
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // delete user
  async delete(username: string) {
    await this.findUser(username);

    return await this.prisma.user.delete({ where: { username } });
  }

  // find user
  async findUser(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    // check user exists
    if (!user) throw new UnauthorizedException();

    return user;
  }

  // get all
  async getAll() {
    return await this.prisma.user.findMany();
  }
}
